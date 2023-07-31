/* eslint-disable capitalized-comments */
const { Events, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
require('dotenv').config();
const { getDefaultEmbed } = require('../utils/stringy');
const { colorDict } = require('../utils/info');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('limeLieModal')) {
			const truth = interaction.fields.getTextInputValue('limeLieRoll_truth');
			const lie = interaction.fields.getTextInputValue('limeLieRoll_lie') ?? truth;
			const description = interaction.fields.getTextInputValue('limeLieRoll_desc');
			console.log(`Truth: ${truth}, Lie: ${lie}`);
			const timestamp = Date.now();
			const embed = getDefaultEmbed()
				.setTitle(`**${description}**`)
				.setDescription(`🎲 Roll result: ${lie}`)
				.setColor(colorDict.LIME);
			const calloutButton = new ButtonBuilder()
				.setCustomId(`callout_${lie}_${truth}_${timestamp}`)
				.setLabel('BS!')
				.setEmoji('📢')
				.setStyle(ButtonStyle.Danger);
			const okayButton = new ButtonBuilder()
				.setCustomId(`alright_${lie}_${truth}_${timestamp}`)
				.setLabel('Alright')
				.setEmoji('✅')
				.setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder()
				.addComponents(okayButton, calloutButton);

			await interaction.reply({ embeds: [embed], components: [row] });

		}
	},
};