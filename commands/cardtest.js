/* eslint-disable capitalized-comments */
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { generateCard } = require('../utils/cards');
const { getDefaultEmbed } = require('../utils/stringy');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cardtest')
		.setDescription('Simple card test command')
		.addSubcommand(subcommand =>
			subcommand
				.setName('binder')
				.setDescription('View the cards you\'ve collected'),
		).addSubcommand(subcommand =>
			subcommand
				.setName('card')
				.setDescription('View a particular card')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('Which card do you want to see?')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('trade')
				.setDescription('Trade cards with another user'),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'binder') {
			return;
		} else if (interaction.options.getSubcommand() === 'card') {
			const card = await generateCard('kaiju_2023', interaction.options.getString('name'));
			const attachment = new AttachmentBuilder(card, { name: 'card.png' });
			const embed = getDefaultEmbed()
				.setImage('attachment://card.png');
			await interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true });
		} else if (interaction.options.getSubcommand() === 'trade') {
			return;
		}
	},
};