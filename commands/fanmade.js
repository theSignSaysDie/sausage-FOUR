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
					{ name: 'Avi\'s Character Sheet Design', value: 0 },
					{ name: 'Neo\'s S&S Level Sheet Design', value: 1 },
					{ name: 'Meme\'s Updating Allowance Sheet Design', value: 2 },
					{ name: 'Neo\'s Troll Quad Sheet Design', value: 3 },
					{ name: 'Jade Community Doc', value: 4 },
					{ name: 'Teal Community Doc', value: 5 },
					{ name: 'Jr. HET Community Doc', value: 6 },
					{ name: 'Jr. SCP Community Doc', value: 7 },
					{ name: 'Serverstuck Classpect Sheet', value: 8 },
					{ name: 'Serverstuck Event Archives', value: 9 },
					{ name: 'Ashen Quadrant Explanation', value: 10 },
					{ name: 'Serverstuck Terminology',	value: 11 },
					{ name: 'Troll Terminology', value: 12 },
					{ name: 'IC Whitelist for Trolls (Upkept by Kids)',	value: 13 },
					{ name: 'Serverstuck Thread Archive Directory', value: 14 },
				),
		),
	async execute(interaction) {
		const choice = interaction.options.getInteger('document');
		await interaction.reply({ content: fanmadeLinks[choice], ephemeral: true });
	},
};
