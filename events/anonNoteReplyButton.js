const { Events, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isButton()) return;
		const id = interaction.customId;
		if (id.startsWith('anonNote_replyButton')) {
			const details = id.replace('anonNote_replyButton_', '').split('_');
			const [snowflake] = details;
			const noteRow = new ActionRowBuilder();
			const noteBox = new TextInputBuilder()
				.setCustomId('anonNoteReply_content')
				.setLabel('Note')
				.setPlaceholder('Enter your reply here')
				.setStyle(TextInputStyle.Paragraph)
				.setMaxLength(2000)
				.setRequired(true);
			noteRow.addComponents(noteBox);
			const modal = new ModalBuilder()
				.setCustomId(`anonNoteReplyModal_${snowflake}`)
				.setTitle('Submit Anonymous Note Reply')
				.addComponents(noteRow);
			await interaction.showModal(modal);
		}
	},
};