/* eslint-disable capitalized-comments */
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { generateCard } = require('../utils/cards');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cardtest')
		.setDescription('Simple card test command'),
	async execute(interaction) {
		const card = await generateCard();
		const attachment = new AttachmentBuilder(card, { name: 'test.png' });
		await interaction.reply({ files: [attachment] });
	},
};