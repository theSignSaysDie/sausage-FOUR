const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/db');
const { titleCase } = require('../utils/stringy');
const { starterTypes } = require('../utils/info');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('starter_edit_')) {
			const details = id.replace('starter_edit_', '').split('_');
			const [user, name] = details;
			let updatedText, query;
			for (let i = 0; i < 3; i++) {
				updatedText = interaction.fields.getTextInputValue(`${id}_${starterTypes[i]}`).replace('`', '');
				query = 'UPDATE `starter` SET `content` = ? WHERE `snowflake` = ? AND `name` = ? AND `type` = ?';
				await fetchSQL(query, [updatedText, user, name, starterTypes[i]]);
			}
			await interaction.reply({ content: `Succesfully updated text for ${titleCase(name)}!`, ephemeral: true });
		}
		return;
	},
};