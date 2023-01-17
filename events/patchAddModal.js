const { Events } = require('discord.js');
const { fetchSQL, sanitizeForQuery } = require('../utils/db');
const { camelize } = require('../utils/stringy');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('patchAddModal_')) {
			const details = id.replace('patchAddModal_', '').split('_');
			const [table] = details;
			let query = `SHOW COLUMNS FROM \`${table}\``;
			const queryResult = await fetchSQL(query);
			const values = [];
			let key;
			for (const item of queryResult) {
				const label = item['Field'];
				if (label === 'key') continue;
				if (label === 'title') {
					key = camelize(interaction.fields.getTextInputValue(`patchAddTextInput_${table}_${label}`));
					values.push(key);
				}
				values.push(sanitizeForQuery(interaction.fields.getTextInputValue(`patchAddTextInput_${table}_${label}`)));
			}
			query = `INSERT INTO \`${table}\` VALUES (${values.map(x => (`"${x}"`)).join(', ')});`;
			await fetchSQL(query);
			await interaction.reply({ content:`Added entry \`${key}\` in table \`${table}\` to new value.`, ephemeral: true });
		}
		return;
	},
};
