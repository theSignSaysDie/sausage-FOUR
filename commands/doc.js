const { SlashCommandBuilder } = require('discord.js');
const { docDict } = require('../utils/info');
const { getDefaultEmbed } = require('../utils/stringy');
const { getDocLink } = require('../utils/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('doc')
		.setDescription('Retrieve system document')
		.addStringOption(option =>
			option.setName('document')
				.setDescription('The name of the document to retrieve')
				.setRequired(false),
		),
	async execute(interaction) {
		const choice = (interaction.options.getString('document') ?? '').toUpperCase();
		const embed = getDefaultEmbed();
		const validChoices = Object.keys(docDict);
		if (choice !== '') {
			if (validChoices.indexOf(choice) > -1) {
				await interaction.reply({ content: getDocLink(docDict[choice]) });
			} else {
				embed.setDescription(`Sorry, I couldn't find any documents matching \`${choice}\`. Check your spelling and try again.`);
				await interaction.reply({ embeds: [embed], ephemeral: true });
			}
		} else {
			embed.setDescription(`Possible document names:\n\n${Object.keys(docDict).join(', ')}`);
			await interaction.reply({ embeds: [embed], ephemeral: true });
		}

	},
};