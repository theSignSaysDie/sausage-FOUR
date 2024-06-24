const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Generate an invite link'),
	category: 'Misc.',
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Invite Sausage!')
					.setStyle(ButtonStyle.Link)
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=${process.env.PERMISSIONS}&scope=${process.env.SCOPE}`),
			);
		await interaction.reply({ components: [row] });
	},
};