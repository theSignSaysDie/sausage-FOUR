const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banish')
		.setDescription('Banish a user from Serverstuck.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Take the shot'),
		).setDefaultMemberPermissions(0),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const modal = new ModalBuilder()
			.setTitle(`Ban ${target.username}#${target.discriminator}`)
			.setCustomId(`banModal_${target.id}_${target.discriminator}`)
			.addComponents(
				new ActionRowBuilder()
					.addComponents(
						new TextInputBuilder()
							.setCustomId(`banModalJustification_${target.id}`)
							.setLabel('Input DM Message here')
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(true),
					),
			).addComponents(
				new ActionRowBuilder()
					.addComponents(
						new TextInputBuilder()
							.setCustomId(`banModalConfirmation_${target.id}`)
							.setLabel('Confirm Ban')
							.setStyle(TextInputStyle.Short)
							.setPlaceholder('Enter the user\'s discriminator verbatim to confirm banishment')
							.setRequired(true),
					),
			);
		await interaction.showModal(modal);
	},
};