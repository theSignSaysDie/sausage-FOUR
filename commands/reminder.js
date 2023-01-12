const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { colorDict } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Remember the important things'),
	async execute(interaction) {
		const embed = getDefaultEmbed()
			.setColor(colorDict.SAUSAGE_UPDATE)
			.setDescription(`
			Hi! This is a reminder for you to do that thing you haven't done yet!
			Stretch if you need to, take your meds, drink some water, have something to eat. Take care of yourself!
		`);
		await interaction.reply({ embeds: [embed] });
	},
};