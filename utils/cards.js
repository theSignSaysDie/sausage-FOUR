// Const Canvas = require('@napi-rs/canvas');
const fs = require('fs');
const { zip } = require('./math');
const { rollWeighted } = require('./dice');
const { cardCache } = require('./info');
const { fetchSQL } = require('./db');

const GradientAlignment = {
	VERTICAL: 'vertical',
	HORIZONTAL: 'horizontal',
};

/**
 * Creates a gradient from a list of stops and colors, either vertically or horizontally
 * @param {Canvas.SKRSContext2D} ctx The context to which the gradient belongs
 * @param {Canvas.Canvas} canvas The canvas upon which the gradient is drawn
 * @param {GradientAlignment} align The alignment of the gradient (assumed to be the size of the image)
 * @param {Array} stop_points A list of stops on interval [0, 1]
 * @param {Array} stop_colors A list of the colors for each stop
 * @returns {CanvasGradient} A finished gradient for use as a path fill
*/
function makeGradient(ctx, canvas, align, stop_points, stop_colors) {
	const grd = ctx.createLinearGradient(0, 0, canvas.width * (align === GradientAlignment.HORIZONTAL), canvas.height * (align === GradientAlignment.VERTICAL));
	for (const i of zip(stop_points, stop_colors)) {
		grd.addColorStop(...i);
	}
	return grd;
}

function loadWeightTable(raw) {
	const result = {};
	for (const i in raw) {
		result[raw[i][0]] = raw[i][1] ?? 1;
	}
	return result;
}

async function getRandomCard(style) {
	const data = JSON.parse(fs.readFileSync(`./cards/${style}/data.json`, 'utf8'));
	const { card_info } = data;
	const { drop_table } = card_info;
	const weightTable = loadWeightTable(drop_table);
	const cardChoice = rollWeighted(weightTable);
	console.log(`Card selected: ${cardChoice}`);
	const cardImage = await getCardImage(style, cardChoice);
	return { name: cardChoice, image: cardImage };
}

async function getCardImage(style, name) {
	const target = `${style}_${name}`;
	if (!(target in cardCache)) {
		cardCache[target] = await generateCard(style, name);
	}
	return cardCache[target];
}

async function generateCard(style, name) {
	const data = JSON.parse(fs.readFileSync(`./cards/${style}/data.json`, 'utf8'));
	const { paintCard } = require(`../cards/${style}/paint.js`);
	console.log('Painting card...');
	const result = await paintCard(data, name);
	console.log('Returning card...');
	return result;
}

async function handlePlayerReward(snowflake, set, name, time) {
	const queryResult = await fetchSQL('SELECT `binder` FROM `player` WHERE `snowflake` = ?', [snowflake]);
	let binder;
	if (queryResult.length) {
		binder = JSON.parse(queryResult[0]['binder']);
	} else {
		binder = {};
	}
	if (!binder[set]) {
		binder[set] = { [name]: 1 };
	} else {
		binder[set][name] = binder[set][name] + 1;
	}
	const blob = JSON.stringify(binder);
	if (queryResult.length) {
		await fetchSQL('UPDATE `player` SET `binder` = ?, `last_drop` = ? WHERE `snowflake` = ?', [blob, time, snowflake]);
		console.log(`Updated ${snowflake}'s binder to \n${blob}`);
	} else {
		await fetchSQL('INSERT INTO `player` VALUES (?, ?, ?)', [snowflake, blob, time]);
		console.log(`Made new player entry for ${snowflake}`);
	}
}

module.exports = {
	makeGradient: makeGradient,
	generateCard: generateCard,
	loadWeightTable: loadWeightTable,
	getRandomCard: getRandomCard,
	handlePlayerReward: handlePlayerReward,
};