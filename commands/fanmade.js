const { SlashCommandBuilder } = require('discord.js');
const { fanmadeLinks } = require('../utils/info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fanmade')
		.setDescription('Retrieve fanmade resource')
		.addStringOption(option =>
			option.setName('document')
				.setDescription('The name of the document to retrieve')
				.setRequired(true)
				.addChoices(
					...Object.keys(fanmadeLinks).map((doc) => ({ name: doc, value: doc })),
				),
		),
	async execute(interaction) {
		const choice = fanmadeLinks[interaction.options.getString('document')];
		await interaction.reply({ content: choice, ephemeral: true });
	},
};
