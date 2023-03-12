const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('anonNoteModal')) {
			console.log('Hee hee hoo hoo');
			const noteText = interaction.fields.getTextInputValue('anonNote_content');
			console.log('NOTE SENT:', noteText, '\n', process.env.ANON_CHANNEL);
			await interaction.client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.ANON_CHANNEL).send(noteText);
			await interaction.reply({ content:'Your message was successfully sent!', ephemeral: true });
		}
	},
};