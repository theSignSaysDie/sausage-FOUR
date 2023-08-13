const { SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../utils/dice');
const { MagicImages } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('breakdance')
		.setDescription('Do a little dance!'),
	async execute(interaction) {
		await interaction.reply(
			rollDice(100)[0] === 96 ? MagicImages.SausageBreakdance : MagicImages.DetectiveDance,
		);
	},
};