require('dotenv').config();
const { Events } = require('discord.js');
const { getRandomCard } = require('../utils/cards');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		// Ignore channels off whitelist
		const procChannels = process.env.PROC_CHANNELS.split(' ');
		if (!procChannels.includes(interaction.channel.id)) return;
		// Ignore bot messages
		if (interaction.author.bot) return;

		const cardChoice = await getRandomCard('kaiju_2023');
		await interaction.client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.BOTHER_CHANNEL).send(`Card selected: ${cardChoice}`);
	},
};