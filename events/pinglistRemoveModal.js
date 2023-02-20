const { Events } = require('discord.js');
const { fetchSQL } = require('../utils/db');
const { titleCase } = require('../utils/stringy');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('pinglist_remove_')) {
			const details = id.replace('pinglist_remove_', '').split('_');
			const [name] = details;
			const confirm = interaction.fields.getTextInputValue(`pinglist_remove_confirm_${name}`);
			let query;
			if (confirm.toLowerCase() === name) {
				query = `DELETE FROM \`pinglist\` WHERE \`name\` = '${name}'`;
				await fetchSQL(query);
				await interaction.reply({ content: `Successfully removed pinglist for ${titleCase(name)}!`, ephemeral: true });
			} else {
				await interaction.reply({ content: 'Sorry, the confirmation prompt failed. Removal canceled.', ephemeral: true });
			}

		}
		return;
	},
};