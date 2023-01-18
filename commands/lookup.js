const { SlashCommandBuilder } = require('discord.js');
const { fetchSQL, getDocLink } = require('../utils/db');
const { camelize, titleCase, getDefaultEmbed, blankUndefined, dictList } = require('../utils/stringy');
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
					...dictList(lookupTableNames),
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
		let query = `SELECT * FROM \`${targetTable}\` WHERE \`key\`="${camelize(key)}";`;
		let queryResult = await fetchSQL(query);
		const embed = getDefaultEmbed();
		if (queryResult.length) {
			const entry = queryResult[0];
			if (entry.text.length > CHAR_LIMIT) {
				entry.text = `\nSorry! Due to Discord's embed character limit, I can't render \`${targetTable}.${key}\` here. Use the doc link above to access the move text! Apologies for the inconvenience.`;
			}
			embed.setTitle(entry.title)
				.setDescription(`${blankUndefined(entry.cost, '**', '**\n')}${blankUndefined(entry.wealth_level, '**', '**\n')}${blankUndefined(entry.tags, '**', '**\n')}${entry.text}`)
				.setColor(colorDict[targetTable === 'move' ? entry.color : 'OTHER'])
				.setURL(getDocLink(docDict[entry.doc] === undefined ? docDict[targetTable.toUpperCase()] : docDict[entry.doc]));
		} else if (targetTable === 'move') {
			const terms = key.split(' ');
			const clauses = [];
			for (const term in terms) {
				const t = terms[term];
				if (t.indexOf('|') >= 0) {
					const subTerms = [];
					const splitTerms = t.split('|');
					for (const st in splitTerms) {
						subTerms.push(`\`tags\` ${splitTerms[st].startsWith('!') ? 'NOT' : '' } REGEXP "[^\\\\w]${splitTerms[st].startsWith('!') ? splitTerms[st].substring(1) : splitTerms[st] }"`);
					}
					clauses.push(`(${subTerms.join(' OR ')})`);
				} else {
					clauses.push(`\`tags\` ${t.startsWith('!') ? 'NOT' : '' } REGEXP "[^\\\\w]${t.startsWith('!') ? t.substring(1) : t }"`);
				}
				// eslint-disable-next-line no-useless-escape
				query = `SELECT \`title\` FROM \`${targetTable}\` WHERE ${clauses.join(' AND ')};`;
				queryResult = await fetchSQL(query);
				if (queryResult.length) {
					const finalString = `${queryResult.map((x) => titleCase(x.title)).join(', ')}`;
					if (finalString.length > CHAR_LIMIT) {
						embed.setDescription(`Sorry! Due to Discord's embed limitations, I can't show you all the moves that satisfy the criteria \`${key}\`. Consider narrowing your search. Apologies for the inconvenience.`);
					} else {
						embed.setTitle(`List of moves with tags similar to '${terms.join(', ')}'`)
							.setDescription(`${queryResult.map((x) => titleCase(x.title)).join(', ')}`)
							.setColor(colorDict.OTHER || colorDict[key.toUpperCase()]);
					}
				} else {
					embed.setDescription(`Sorry, I couldn't find anything for \`${key}\`.`);
				}
			}
		}
		await interaction.reply({ embeds: [embed] });
	},
};