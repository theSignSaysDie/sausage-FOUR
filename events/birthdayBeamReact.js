const { Events } = require('discord.js');
const { birthdays } = require('../utils/info');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		if (birthdays.indexOf(interaction.author.id) !== -1) {
			await interaction.react('🍰');
		}
	},
};