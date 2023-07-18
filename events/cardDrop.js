/* eslint-disable capitalized-comments */
require('dotenv').config();
const { Events, AttachmentBuilder } = require('discord.js');
const { getRandomCard } = require('../utils/cards');
const { getDefaultEmbed } = require('../utils/stringy');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		// Ignore channels off whitelist
		const procChannels = process.env.PROC_CHANNELS.split(' ');
		if (!procChannels.includes(interaction.channel.id)) return;
		// Ignore bot messages
		if (interaction.author.bot) return;

		const cardImage = await getRandomCard('kaiju_2023');
		const attachment = new AttachmentBuilder(cardImage, { name: 'card.png' });
		const embed = getDefaultEmbed()
			.setImage('attachment://card.png');
		const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
		const botherChannel = await guild.channels.cache.get(process.env.BOTHER_CHANNEL);
		await botherChannel.send({ embeds: [embed], files: [attachment] });
	},
};