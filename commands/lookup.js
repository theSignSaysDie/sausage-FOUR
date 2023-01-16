const { SlashCommandBuilder } = require('discord.js');
const { fetchSQL, getDocLink } = require('../utils/db');
const { camelize, getDefaultEmbed, blankUndefined } = require('../utils/stringy');
const { CHAR_LIMIT, colorDict, docDict, lookupTableNames } = require('../utils/info');

const lookupSlashCommand =
	new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Retrieve rulebook entries')
		.addStringOption(option =>
			option
				.setName('category')
				.setDescription('Select the category you want to look into')
				.setRequired(true)
				.setChoices(
					...lookupTableNames.map((item) => ({ name: item, value: item })),
				),
		).addStringOption(option =>
			option
				.setName('key')
				.setDescription('The name of the entry you want')
				.setRequired(true),
		);

module.exports = {
	data: lookupSlashCommand,
	async execute(interaction) {
		const key = interaction.options.getString('key');
		const targetTable = interaction.options.getString('category');
		const query = `SELECT * FROM \`${targetTable}\` WHERE \`key\`="${camelize(key)}";`;
		const queryResult = await fetchSQL(query);
		const embed = getDefaultEmbed();
		if (queryResult.length) {
			const entry = queryResult[0];
			if (entry.text.length > CHAR_LIMIT) {
				entry.text = `\nSorry! Due to Discord's embed character limit, I can't render ${targetTable}.${key} here. Use the doc link above to access the move text! Apologies for the inconvenience.`;
			}
			embed.setTitle(entry.title)
				.setDescription(`${blankUndefined(entry.cost, '**', '**\n')}${blankUndefined(entry.wealth_level, '**', '**\n')}${blankUndefined(entry.tags, '**', '**\n')}${entry.text}`)
				.setColor(colorDict[targetTable === 'move' ? entry.color : 'OTHER'])
				.setURL(getDocLink(docDict[entry.doc] === undefined ? docDict[targetTable.toUpperCase()] : docDict[entry.doc]));
		} else {
			embed.setDescription(`Sorry, I couldn't find anything for '${key}'.`);
		}
		await interaction.reply({ embeds: [embed] });
	},
};