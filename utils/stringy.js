const { EmbedBuilder } = require('discord.js');
const { versionNum, lastUpdated } = require('../utils/info');

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function titleCase(str) {
	return str.toLowerCase().split(' ').map(function(word) {
		return word.replace(word[0], word[0].toUpperCase());
	}).join(' ');
}

function camelize(str) {
	return titleCase(str)
		.replace(/[^ a-zA-Z]/, '')
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

function getDefaultEmbed() {
	return new EmbedBuilder().setFooter({ text: `Sausage ${versionNum}   |   Last update -> ${lastUpdated.toLocaleString('en-US', { dateStyle: 'short' })}  |   Do /help for more commands` });
}

function blankUndefined(thing, prefix = '', suffix = '') {
	return thing === undefined ? '' : `${prefix}${thing}${suffix}`;
}

function dictList(stringArr) {
	return stringArr.map((item) => ({ name: item, value: item }));
}

module.exports = {
	capitalize: capitalize,
	camelize: camelize,
	getDefaultEmbed: getDefaultEmbed,
	blankUndefined: blankUndefined,
	titleCase: titleCase,
	dictList : dictList,
};