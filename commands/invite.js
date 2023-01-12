const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Generate an invite link'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Invite Sausage!')
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.com/api/oauth2/authorize?client_id=1057044181513683095&permissions=414464666688&scope=bot%20applications.commands'),
			);
		await interaction.reply({ components: [row] });
	},
};