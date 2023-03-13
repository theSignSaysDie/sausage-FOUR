const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('anon-note')
		.setDescription('Report an issue anonymously'),
	async execute(interaction) {
		try {
			const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
			// Throws error if user isn't in the guild
			await guild.members.fetch(interaction.user.id);
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
		} catch {
			await interaction.reply('Sorry, but you don\'t have permission to use this command.');
		}
	},
};