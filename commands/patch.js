const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { fetchSQL } = require('../utils/lookup');
const { camelize, getDefaultEmbed } = require('../utils/stringy');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patch')
		.setDescription('Perform live edits to the rules database')
		.addStringOption(option =>
			option.setName('table')
				.setDescription('Table whose entry you want to edit')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('key')
				.setDescription('Key of entry you want to edit')
				.setRequired(true),
		).setDefaultMemberPermissions(0),
	async execute(interaction) {
		const table = camelize(interaction.options.getString('table'));
		const key = camelize(interaction.options.getString('key'));
		let query = `SHOW TABLES LIKE '${table}'`;
		let queryResult = await fetchSQL(query);
		if (queryResult.length) {
			query = `SELECT 1 FROM ${table} WHERE \`key\` = '${key}';`;
			queryResult = await fetchSQL(query);
			if (queryResult.length) {
				query = `SHOW COLUMNS FROM \`${table}\``;
				queryResult = await fetchSQL(query);
				const buttons = new ActionRowBuilder();
				for (const item of queryResult) {
					const label = item['Field'];
					if (label === 'key') continue;
					buttons.addComponents(
						new ButtonBuilder()
							.setCustomId(`patchButton_${table}_${key}_${label}`)
							.setLabel(label)
							.setStyle(ButtonStyle.Primary),
					);
				}
				await interaction.reply({ components: [buttons], ephemeral: true });
			} else {
				await interaction.reply({ content: `Sorry, I couldn't find anything for key '${key}' in table '${table}'. Check your spelling and try again!`, ephemeral: true });
			}
		} else {
			const embed = getDefaultEmbed()
				.setDescription(`Sorry, I couldn't find anything for table '${table}'. Check your spelling and try again!`);
			await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};