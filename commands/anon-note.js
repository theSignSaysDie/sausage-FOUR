const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('anon-note')
		.setDescription('Report an issue anonymously'),
	async execute(interaction) {
		const noteRow = new ActionRowBuilder();
		const noteBox = new TextInputBuilder()
			.setCustomId('anonNote_content')
			.setLabel('Note')
			.setPlaceholder('What\'s on your mind?')
			.setStyle(TextInputStyle.Paragraph)
			.setMaxLength(3200)
			.setRequired(true);
		noteRow.addComponents(noteBox);
		const modal = new ModalBuilder()
			.setCustomId('anonNoteModal')
			.setTitle('Submit Anonymous Note')
			.addComponents(noteRow);

		await interaction.showModal(modal);
	},
};