const { SlashCommandBuilder } = require('discord.js');
const { fanmadeLinks } = require('../utils/info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fanmade')
		.setDescription('Retrieve fanmade resource')
		.addIntegerOption(option =>
			option.setName('document')
				.setDescription('The name of the document to retrieve')
				.setRequired(true)
				.addChoices(
					...Object.keys(fanmadeLinks).map((doc, index) => ({ name: doc, value: index })),
				),
		),
	async execute(interaction) {
		const choice = fanmadeLinks[interaction.options.getInteger('document')];
		await interaction.reply({ content: choice, ephemeral: true });
	},
};
