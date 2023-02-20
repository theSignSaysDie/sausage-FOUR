const { Events } = require('discord.js');
const { fetchSQL, sanitizeForQuery } = require('../utils/db');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isButton()) return;
		const id = interaction.customId;
		const user = interaction.user.id;
		if (id.startsWith('pinglist_join_')) {
			const details = id.replace('pinglist_join_', '').split('_');
			const [name] = details;
			let query = `SELECT * FROM \`pinglist\` WHERE \`name\` = '${name}' AND \`record\` = 'author' AND \`snowflake\` = '${user}'`;
			let result = await fetchSQL(query);
			if (result.length) {
				await interaction.reply({ content: 'Wouldn\'t you already be there for that, though?', ephemeral: true });
			} else {
				query = `SELECT * FROM \`pinglist\` WHERE \`name\` = '${name}' AND \`record\` = 'subscriber' AND \`snowflake\` = '${user}'`;
				result = await fetchSQL(query);
				if (!result.length) {
					query = `INSERT INTO \`pinglist\` VALUES ('${sanitizeForQuery(user)}', 'subscriber', '${sanitizeForQuery(name)}')`;
					await fetchSQL(query);
					await interaction.reply({ content: `You joined the \`${name}\` pinglist!`, ephemeral: true });
				} else {
					await interaction.reply({ content: `Looks like you're already in the \`${name}\` pinglist! Nice!`, ephemeral: true });
				}
			}
		} else if (id.startsWith('pinglist_leave_')) {
			const details = id.replace('pinglist_leave_', '').split('_');
			const [name] = details;
			let query = `SELECT * FROM \`pinglist\` WHERE \`name\` = '${name}' AND \`record\` = 'author' AND \`snowflake\` = '${user}'`;
			let result = await fetchSQL(query);
			if (result.length) {
				await interaction.reply({ content: `Leaving your own pinglist? Use \`/pinglist delete ${name}\` instead.`, ephemeral: true });
			} else {
				query = `SELECT * FROM \`pinglist\` WHERE \`name\` = '${name}' AND \`record\` = 'subscriber' AND \`snowflake\` = '${user}'`;
				result = await fetchSQL(query);
				if (!result.length) {
					await interaction.reply({ content: `You don't seem to be in the \`${name}\` pinglist!`, ephemeral: true });
				} else {
					query = `DELETE FROM \`pinglist\` WHERE \`name\` = '${name}' AND \`snowflake\` = '${user}' AND \`record\` = 'subscriber';`;
					await fetchSQL(query);
					await interaction.reply({ content: `You've left the \`${name}\` pinglist! Goodbye!`, ephemeral: true });
				}
			}
		}
	},
};
