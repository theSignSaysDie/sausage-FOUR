const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Generate an invite link'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://discord.com/api/oauth2/authorize?client_id=1057044181513683095&permissions=414464666688&scope=bot%20applications.commands', ephemeral: true });
	},
};