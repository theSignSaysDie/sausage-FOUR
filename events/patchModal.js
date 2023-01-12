const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/lookup');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('patchModal_')) {
			const details = id.replace('patchModal_', '').split('_');
			const [table, key, column] = details;
			const updatedText = interaction.fields.getTextInputValue(`patchTextInput_${table}_${key}_${column}`);
			const query = `UPDATE \`${table}\` SET \`${column}\` = "${updatedText}" WHERE \`key\` = '${key}'`;
			await fetchSQL(query);
			await interaction.reply({ content:`Updated column \`${column}\` for key \`${key}\` in table \`${table}\` to new value.`, ephemeral: true });
		}
		return;
	},
};
