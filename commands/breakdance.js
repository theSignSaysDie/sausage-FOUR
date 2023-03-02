const { SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../utils/dice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('breakdance')
		.setDescription('Do a little dance!'),
	async execute(interaction) {
		await interaction.reply(
			rollDice(100)[0] === 96 ? 'https://cdn.discordapp.com/attachments/973998578215292971/1080029136053084230/ezgif-5-5e4aa51e3e.gif' : '<a:dancedetectivedance:847562900419510283>',
		);
	},
};