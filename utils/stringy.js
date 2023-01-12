const { EmbedBuilder } = require('discord.js');
const { versionNum, lastUpdated } = require('../utils/info');

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelize(str) {
	return str
		.replace(/[^ a-zA-Z]/, '')
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

function getDefaultEmbed() {
	return new EmbedBuilder().setFooter({ text: `Sausage ${versionNum}   |   Last update -> ${lastUpdated.toLocaleString('en-US', { dateStyle: 'short' })}  |   Do /help for more commands` });
}


module.exports = {
	capitalize: capitalize,
	camelize: camelize,
	getDefaultEmbed: getDefaultEmbed,
};