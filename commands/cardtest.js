/* eslint-disable capitalized-comments */
const { SlashCommandBuilder } = require('discord.js');
const { postCard, fetchBinder, getPrettyBinderSummary } = require('../utils/cards');
const { currentSet } = require('../utils/info');
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
			const binder = await fetchBinder(interaction.user.id);
			const summary = await getPrettyBinderSummary(currentSet, binder);
			const embed = getDefaultEmbed()
				.setTitle('Binder Contents')
				.setDescription(summary);
			await interaction.reply({ embeds: [embed] });
		} else if (interaction.options.getSubcommand() === 'card') {
			await interaction.reply(await postCard(currentSet, interaction.options.getString('name')));
		} else if (interaction.options.getSubcommand() === 'trade') {
			return;
		}
	},
};