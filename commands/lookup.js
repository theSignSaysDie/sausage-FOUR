const { SlashCommandBuilder } = require('discord.js');
const { fetchSQL, getDocLink } = require('../utils/db');
const { camelize, titleCase, getDefaultEmbed, blankUndefined, dictList } = require('../utils/stringy');
const { CHAR_LIMIT, colorDict, docDict, lookupTableNames } = require('../utils/info');

function renderMove(embed, entry, key) {
	if (entry.text.length > CHAR_LIMIT) {
		entry.text = `\nSorry! Due to Discord's embed character limit, I can't render \`move.${key}\` here. Use the doc link above to access the move text! Apologies for the inconvenience.`;
	}
	embed.setTitle(entry.title)
		.setDescription(`${blankUndefined(entry.cost, '**', '**\n')}${blankUndefined(entry.wealth_level, '**', '**\n')}${blankUndefined(entry.tags, '**', '**\n')}${entry.text}`)
		.setColor(colorDict[entry.color])
		.setURL(getDocLink(docDict[entry.doc] === undefined ? docDict['MOVE'] : docDict[entry.doc]));
	return embed;
}

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
		let query = 'SELECT * FROM ?? WHERE `key` = ?;';
		let queryResult = await fetchSQL(query, [targetTable, camelize(key)]);
		let embed = getDefaultEmbed();
		if (queryResult.length) {
			const entry = queryResult[0];
			if (targetTable === 'move') {
				embed = renderMove(embed, entry, key);
			} else {
				embed.setTitle(entry.title)
					.setDescription(entry.text)
					.setURL(getDocLink(docDict[targetTable.toUpperCase()]));
			}
		} else if (targetTable === 'move') {
			console.log('GHAGHS');
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
			}
			query = `SELECT \`title\` FROM \`${targetTable}\` WHERE ${clauses.join(' AND ')};`;
			queryResult = await fetchSQL(query);
			if (queryResult.length) {
				const finalString = `${queryResult.map((x) => titleCase(x.title)).join(', ')}`;
				if (finalString.length > CHAR_LIMIT) {
					embed.setDescription(`Sorry! Due to Discord's embed limitations, I can't show you all the moves that satisfy the criteria \`${key}\`. Consider narrowing your search. Apologies for the inconvenience.`);
				} else if (queryResult.length === 1) {
					const title = queryResult[0].title;
					query = 'SELECT * FROM ?? WHERE `title` = ?;';
					queryResult = await fetchSQL(query, ['move', title]);
					const entry = queryResult[0];
					embed = renderMove(embed, entry, key);
				} else {
					embed.setTitle(`List of moves with tags similar to '${terms.join(', ')}'`)
						.setDescription(`${queryResult.map((x) => titleCase(x.title)).join(', ')}`)
						.setColor(colorDict.OTHER || colorDict[key.toUpperCase()]);
				}
			} else {
				embed.setDescription(`Sorry, I couldn't find anything for \`${key}\`.`);
			}
		} else {
			embed.setDescription(`Sorry, I couldn't find anything matching \`${key}\`. Double check your spelling and try again.`);
		}
		await interaction.reply({ embeds: [embed] });
	},
};