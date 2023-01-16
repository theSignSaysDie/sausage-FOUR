const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/db');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('patchDropModal_')) {
			const details = id.replace('patchDropModal_', '').split('_');
			console.log('EDJHUDSFJG', id, details);
			const [table, key] = details;
			const confirmText = interaction.fields.getTextInputValue(`patchDropTextInput_${table}_${key}`);
			if (confirmText == key) {
				const query = `DELETE FROM \`${table}\` WHERE \`key\` = "${key}"`;
				await fetchSQL(query);
				await interaction.reply({ content:`Removed entry \`${key}\` in table \`${table}\`.`, ephemeral: true });
			} else {
				await interaction.reply({ content: 'Sorry, your text entry didn\'t match, and because of Discord API limitations I can\'t display the same modal again. Apologies for the inconvenience.', ephemeral: true });
			}
		}
		return;
	},
};
