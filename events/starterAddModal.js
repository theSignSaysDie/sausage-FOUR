const { Events } = require('discord.js');
const { fetchSQL, sanitizeForQuery } = require('../utils/db');
const { titleCase } = require('../utils/stringy');
const { starterTypes } = require('../utils/info');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('starter_add_')) {
			const details = id.replace('starter_add_', '').split('_');
			const [user, name] = details;
			let updatedText, query;
			for (let i = 0; i < 3; i++) {
				updatedText = interaction.fields.getTextInputValue(`${id}_${starterTypes[i]}`);
				query = `INSERT INTO \`starter\` VALUES ('${sanitizeForQuery(user)}', '${sanitizeForQuery(name)}', '${sanitizeForQuery(starterTypes[i])}', '${sanitizeForQuery(updatedText)}')`;
				await fetchSQL(query);
			}
			await interaction.reply({ content: `Succesfully added text for ${titleCase(name)}!`, ephemeral: true });
		}
		return;
	},
};