const { colorDict } = require('../utils/info');
const { RNG } = require('../utils/prng');

const random = RNG();

function rollWeighted() {
	let cumulativeWeights;
	let myChoices;
	if (arguments.length === 1) {
		myChoices = Object.keys(arguments[0]);
		cumulativeWeights = Object.values(arguments[0]).map((sum => value => sum += value)(0));
	} else if (arguments.length === 2) {
		myChoices = arguments[0];
		cumulativeWeights = arguments[1].map((sum => value => sum += value)(0));
	}
	const weightMax = cumulativeWeights.slice(-1)[0];
	const roll = roll1ToX(weightMax);
	for (let i = 0; i < cumulativeWeights.length; i++) {
		if (cumulativeWeights[i] >= roll) {
			return myChoices[i];
		}
	}
}

function rollFloat() {
	return random();
}

function roll1ToX(diceType) {
	return Math.floor(rollFloat() * diceType) + 1;
}

function rollDice(diceType, amt = 1, talent = 0) {
	const result = [];
	for (let i = 0; i < amt + Math.abs(talent); i++) {
		const roll = roll1ToX(diceType);
		result.push(roll);
	}
	return result;
}

function markForSum(arr, num, talent) {
	let result;
	(result = []).length = arr.length;
	result.fill(0);
	const keys = Array.from({ length: arr.length }, (v, k) => k);
	keys.sort((a, b) => (talent < 0 ? arr[a] - arr[b] : arr[b] - arr[a]));
	for (let i = 0; i < num; i++) {
		result[keys[i]] = 1;
	}
	return result;
}

function modStr(num, spacey = false) {
	return num ? `${spacey ? ' ' : ''}${num !== 0 ? (num > 0 ? '+' : '-') : ''}${spacey ? ' ' : ''}${Math.abs(num)}` : '';
}

function formatRoll(diceType, talent, modifier) {
	const baseDice = { 2: 8, 4: 4, 10: 1, 8: 2 };
	const addlDice = { 8: talent, 4: 2 * talent, 10: talent, 2: 0 };
	const numArr = rollDice(diceType, baseDice[diceType], addlDice[diceType]);
	const indices = markForSum(numArr, baseDice[diceType], talent);
	let totalSum = 0;
	for (let i = 0; i < numArr.length; i++) {
		totalSum += numArr[i] * indices[i];
	}
	let max = false;
	let min = false;
	if (diceType === 8) {
		if (totalSum === 16 || totalSum + modifier >= 20) {
			max = true;
		}
		if (totalSum === 2 || totalSum + modifier < 0) {
			min = true;
		}
	}

	const stringNums = [];
	for (let i = 0; i < numArr.length; i++) {
		let item = `${numArr[i]}`;
		if (numArr[i] === 1 || numArr[i] === diceType) {
			item = `**${item}**`;
		}
		if (indices[i] === 0) {
			item = `~~${item}~~`;
		}
		stringNums.push(item);
	}

	const extraDie = diceType === 10 ? rollDice(6, 1, 0)[0] : 0;

	totalSum += extraDie + modifier * (diceType !== 2);
	return { weird: diceType !== 8, min: min, max: max, sum: totalSum, text: `(${stringNums.join(', ')}${diceType === 10 ? modStr(extraDie, true) : ''})${diceType === 2 ? '' : modStr(modifier, true)}\n**Total**: ${totalSum}` };
}

function formatRawRoll(amt, size, keeps, mod) {
	const numArr = rollDice(size, amt);
	const indices = markForSum(numArr, keeps === 0 ? amt : Math.abs(keeps), keeps);
	let totalSum = 0;
	for (let i = 0; i < numArr.length; i++) {
		totalSum += numArr[i] * indices[i];
	}

	const stringNums = [];
	for (let i = 0; i < numArr.length; i++) {
		let item = `${numArr[i]}`;
		if (numArr[i] === 1 || numArr[i] === size) {
			item = `**${item}**`;
		}
		if (indices[i] === 0) {
			item = `~~${item}~~`;
		}
		stringNums.push(item);
	}

	totalSum += mod;
	return { sum: totalSum, text: `(${stringNums.join(', ')})${modStr(mod, true)}\n**Total**: ${totalSum}` };
}

function getRollColor(rollResult) {
	let result = colorDict.BOT;
	if (rollResult.sum < 0) result = colorDict.RUST;
	if (rollResult.sum >= 0) result = colorDict.BRONZE;
	if (rollResult.sum >= 8) result = colorDict.GOLD;
	if (rollResult.sum >= 11) result = colorDict.OLIVE;
	if (rollResult.sum >= 14) result = colorDict.INDIGO;
	if (rollResult.min) result = colorDict.RUST;
	if (rollResult.max)	result = colorDict.FUCHSIA;
	if (rollResult.weird) result = colorDict.LIME;
	return result;
}

module.exports = {
	rollWeighted: rollWeighted,
	rollDice: rollDice,
	modStr: modStr,
	formatRoll: formatRoll,
	formatRawRoll: formatRawRoll,
	getRollColor: getRollColor,
	roll1ToX: roll1ToX,
	rollFloat: rollFloat,
};