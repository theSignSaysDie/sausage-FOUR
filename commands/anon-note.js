const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('anon-note')
		.setDescription('Report an issue anonymously'),
	async execute(interaction) {
		console.log('AGGGAGAGGAGA');
		try {
			console.log(interaction.user.nickname);
			console.log('Fetching guild...');
			const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
			// Throws error if user isn't in the guild
			console.log(interaction.user.id);
			await guild.members.fetch(interaction.user.id);
			console.log('Building action row and text input...');
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
			console.log('Showing modal....');
			await interaction.showModal(modal);
			console.log('Modal shown.');
		} catch (e) {
			console.log('Uh oh spaghettios');
			console.log(e);
			await interaction.reply('Sorry, but you don\'t have permission to use this command.');
		}
		console.log('Done sending anon note');
	},
};