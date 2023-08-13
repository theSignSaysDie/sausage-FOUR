const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { colorDict, rulesText } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Review the server rules'),
	async execute(interaction) {
		const embed = getDefaultEmbed()
			.setColor(colorDict.SAUSAGE_UPDATE)
			.setTitle('RULES')
			.setDescription(rulesText);
		await interaction.reply({ embeds: [embed] });
	},
};