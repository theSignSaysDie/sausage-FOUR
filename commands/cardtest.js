/* eslint-disable capitalized-comments */
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { generateCard } = require('../utils/cards');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cardtest')
		.setDescription('Simple card test command'),
	async execute(interaction) {
		const card = await generateCard('kaiju_2023', 'banansa');
		const attachment = new AttachmentBuilder(card, { name: 'test.png' });
		await interaction.reply({ files: [attachment] });
	},
};