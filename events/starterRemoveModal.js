const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/db');
const { titleCase } = require('../utils/stringy');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('starter_remove_')) {
			const details = id.replace('starter_remove_', '').replace('_confirm', '').split('_');
			const [user, name] = details;
			const confirm = interaction.fields.getTextInputValue(`${id}_confirm`);
			let query;
			console.log(confirm, name);
			if (confirm.toLowerCase() === name) {

				query = 'DELETE FROM `starter` WHERE `snowflake` = ? AND `name` = ?';
				await fetchSQL(query, [user, name]);
				await interaction.reply({ content: `Succesfully removed text for ${titleCase(name)}!`, ephemeral: true });
			} else {
				await interaction.reply({ content: 'Sorry, the confirmation prompt failed. Removal canceled.', ephemeral: true });
			}

		}
		return;
	},
};