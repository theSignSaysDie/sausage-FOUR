/* eslint-disable capitalized-comments */
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { generateCard } = require('../utils/cards');
const { getDefaultEmbed } = require('../utils/stringy');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cardtest')
		.setDescription('Simple card test command')
		.addStringOption(option =>
			option
				.setName('card')
				.setDescription('Which card do you want to see?')
				.setRequired(true),
		),
	async execute(interaction) {
		const card = await generateCard('kaiju_2023', interaction.options.getString('card'));
		const attachment = new AttachmentBuilder(card, { name: 'card.png' });
		const embed = getDefaultEmbed()
			.setImage('attachment://card.png');
		await interaction.reply({ embeds: [embed], files: [attachment] });
	},
};