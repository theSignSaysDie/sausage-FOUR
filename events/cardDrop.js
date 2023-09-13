require('dotenv').config();
const { Events, AttachmentBuilder } = require('discord.js');
const { getRandomCard, handlePlayerReward } = require('../utils/cards');
const { getDefaultEmbed } = require('../utils/stringy');
const { colorDict, currentPool, cardDropWaitTime, cardDropChance } = require('../utils/info');
const { fetchSQL } = require('../utils/db');
const { rollFloat } = require('../utils/dice');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		// Ignore all other servers
		if (interaction.guildId !== process.env.GUILD_ID) return;
		// Ignore channels off whitelist
		const procChannels = process.env.BLOCKED_PROC_CATEGORIES.split(' ');
		if (procChannels.includes(interaction.channel.parent.id)) return;
		// Ignore bot messages
		if (interaction.author.bot) return;

		// Don't reward players on cooldown
		const now = Math.floor(Date.now() / 1000);
		const queryResult = await fetchSQL('SELECT `last_drop` FROM `player` WHERE `snowflake` = ?', [interaction.author.id]);
		if (queryResult.length) {
			const lastDropTime = queryResult[0]['last_drop'];
			if (now - lastDropTime < cardDropWaitTime) return;
		}

		// Don't reward unlucky players
		if (rollFloat() > cardDropChance) return;

		// Generate card or retrieve from cache
		// TODO amend to draw from master file in info.js rather than current set
		const { name, image, set } = await getRandomCard(currentPool);
		// Send embed
		const attachment = new AttachmentBuilder(image, { name: 'card.png' });
		const embed = getDefaultEmbed()
			.setColor(colorDict.OTHER)
			.setTitle('Congrats, you just found a card!')
			.setDescription('This card has been automatically added to your binder!')
			.setImage('attachment://card.png');
		const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
		const botherChannel = await guild.channels.cache.get(process.env.BOTHER_CHANNEL);
		await botherChannel.send({ content: `<@${interaction.author.id}>`, embeds: [embed], files: [attachment] });

		await handlePlayerReward(interaction.author.id, set, name, now);
	},
};