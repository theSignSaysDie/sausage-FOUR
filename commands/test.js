const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Simple Test Command!'),
	async execute(interaction) {
		await interaction.reply('Hai!');
	},
};