const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/db');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isButton()) return;
		const id = interaction.customId;
		const user = interaction.user.id;
		if (id.startsWith('pinglist_join_')) {
			const details = id.replace('pinglist_join_', '').split('_');
			const [name] = details;
			let query = 'SELECT * FROM `pinglist` WHERE `name` = ? AND `record` = \'author\' AND `snowflake` = ?';
			let result = await fetchSQL(query, [name, user]);
			if (result.length) {
				await interaction.reply({ content: 'Wouldn\'t you already be there for that, though?', ephemeral: true });
			} else {
				query = 'SELECT * FROM `pinglist` WHERE `name` = ? AND `record` = \'subscriber\' AND `snowflake` = ?';
				result = await fetchSQL(query, [name, user]);
				if (!result.length) {
					query = 'INSERT INTO `pinglist` VALUES (?, \'subscriber\', ?)';
					await fetchSQL(query, [user, name]);
					await interaction.reply({ content: `You joined the \`${name}\` pinglist!`, ephemeral: true });
				} else {
					await interaction.reply({ content: `Looks like you're already in the \`${name}\` pinglist! Nice!`, ephemeral: true });
				}
			}
		} else if (id.startsWith('pinglist_leave_')) {
			const details = id.replace('pinglist_leave_', '').split('_');
			const [name] = details;
			let query = 'SELECT * FROM `pinglist` WHERE `name` = ? AND `record` = \'author\' AND `snowflake` = ?';
			let result = await fetchSQL(query, [name, user]);
			if (result.length) {
				await interaction.reply({ content: `Leaving your own pinglist? Use \`/pinglist delete ${name}\` instead.`, ephemeral: true });
			} else {
				query = 'SELECT * FROM `pinglist` WHERE `name` = ? AND `record` = \'subscriber\' AND `snowflake` = ?';
				result = await fetchSQL(query, [name, user]);
				if (!result.length) {
					await interaction.reply({ content: `You don't seem to be in the \`${name}\` pinglist!`, ephemeral: true });
				} else {
					query = 'DELETE FROM `pinglist` WHERE `name` = ? AND `snowflake` = ? AND `record` = \'subscriber\'';
					await fetchSQL(query, [name, user]);
					await interaction.reply({ content: `You've left the \`${name}\` pinglist! Goodbye!`, ephemeral: true });
				}
			}
		}
	},
};
