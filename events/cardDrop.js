require('dotenv').config();
const { Events } = require('discord.js');
const { getRandomCard, handlePlayerReward, postCard } = require('../utils/cards');
const { currentPool, cardDropWaitTime, cardDropChance, droppingCards } = require('../utils/info');
const { fetchSQL } = require('../utils/db');
const { rollFloat } = require('../utils/dice');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		if (!droppingCards) return;
		// Ignore all other servers
		if (interaction.guildId !== process.env.GUILD_ID) return;
		// Ignore channels off whitelist
		const procChannels = process.env.BLOCKED_PROC_CATEGORIES.split(' ');
		if (procChannels.includes(interaction.channel.parent.id) || procChannels.includes((interaction.channel.parent.parent ?? { id: 'nada' }).id)) return;
		// Ignore bot messages
		if (interaction.author.bot) return;

		// Don't reward players on cooldown
		const now = Date.now();
		const queryResult = await fetchSQL('SELECT `last_drop` FROM `player` WHERE `snowflake` = ?', [interaction.author.id]);
		if (queryResult.length) {
			let lastDropTime = parseInt(queryResult[0]['last_drop']);
			lastDropTime = isNaN(lastDropTime) ? 0 : lastDropTime;
			if (now - lastDropTime < cardDropWaitTime) return;
		}

		// Don't reward unlucky players
		if (rollFloat() > cardDropChance) return;

		// Generate card or retrieve from cache

		const { name, set, desc, spoiler } = await getRandomCard(currentPool);
		// Send embed
		const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
		const botherChannel = await guild.channels.cache.get(process.env.BOTHER_CHANNEL);
		await botherChannel.send(await postCard({ set: set, name: name, desc: desc, content: `<@${interaction.author.id}>`, spoiler: spoiler }));

		await handlePlayerReward(interaction.author.id, set, name, now);
	},
};