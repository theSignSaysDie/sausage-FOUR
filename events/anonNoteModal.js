const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('anonNoteModal')) {
			const noteText = interaction.fields.getTextInputValue('anonNote_content');
			await interaction.client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.ANON_CHANNEL).send(noteText);
			await interaction.reply({ content:'Your message was successfully sent!', allowedMentions: { users: [] }, ephemeral: true });
		}
	},
};