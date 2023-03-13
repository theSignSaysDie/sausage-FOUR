const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/db');
const { titleCase } = require('../utils/stringy');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('pinglist_delete_')) {
			const details = id.replace('pinglist_delete_', '').split('_');
			const [name, user] = details;
			const confirm = interaction.fields.getTextInputValue(`pinglist_delete_confirm_${name}_${user}`);
			let query;
			if (confirm.toLowerCase() === name) {
				query = 'DELETE FROM `pinglist` WHERE `name` = ?';
				await fetchSQL(query, [name]);
				await interaction.reply({ content: `Successfully deleted pinglist for ${titleCase(name)}!`, ephemeral: true });
			} else {
				await interaction.reply({ content: 'Sorry, the confirmation prompt failed. Deletion canceled.', ephemeral: true });
			}
		} else if (id.startsWith('pinglist_rename_')) {
			const details = id.replace('pinglist_rename_', '').split('_');
			const [name, user] = details;
			const newName = interaction.fields.getTextInputValue(`pinglist_rename_newName_${name}_${user}`);
			let query = 'SELECT * FROM `pinglist` WHERE `name` = ?';
			const queryResult = await fetchSQL(query, [newName]);
			if (queryResult.length) {
				await interaction.reply({ content: 'Sorry, a pinglist under that name already exists in the system. Please select another name.\n(If this presents a major inconvenience, ping Meme.)', ephemeral: true });
			} else {
				query = 'UPDATE `pinglist` SET `name` = ? WHERE `name` = ?';
				await fetchSQL(query, [newName, name, user]);
				await interaction.reply({ content: `Renamed pinglist \`${name}\` to \`${newName}\`.`, ephemeral: true });
			}
		}
	},
};