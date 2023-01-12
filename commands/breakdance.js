const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('breakdance')
		.setDescription('Do a little dance!'),
	async execute(interaction) {
		await interaction.reply('<a:dancedetectivedance:847562900419510283>');
	},
};