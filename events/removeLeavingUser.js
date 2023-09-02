const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/db');
require('dotenv').config();

module.exports = {
	name: Events.GuildBanAdd,
	async execute(interaction) {
		// Retrieve snowflake of banned user
		const bannedUserSnowflake = interaction.user.id;

		// Get all pinglists the banned user authored, delete them
		let query = 'SELECT `name` FROM `pinglist` WHERE `snowflake` = ? AND `record` = \'author\'';
		const bannedUserPinglists = await fetchSQL(query, [bannedUserSnowflake]);
		for (const record of bannedUserPinglists) {
			query = 'DELETE FROM `pinglist` WHERE `name` = ?';
			await fetchSQL(query, [record.name]);
		}

		// Remove banned user from remaining pinglists
		query = 'DELETE FROM `pinglist` WHERE `snowflake` = ?';
		await fetchSQL(query, [bannedUserSnowflake]);

		// Delete banned user's card binder
		query = 'DELETE FROM `player` WHERE `snowflake` = ?';
		await fetchSQL(query, [bannedUserSnowflake]);
	},
};