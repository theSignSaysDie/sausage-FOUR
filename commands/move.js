const { SlashCommandBuilder } = require('discord.js');
const { fetchSQL, getDocLink } = require('../utils/lookup');
const { camelize, getDefaultEmbed } = require('../utils/stringy');
const { CHAR_LIMIT, colorDict, docDict } = require('../utils/info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Retrieve move information')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the move to retrieve')
				.setRequired(true),
		),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const query = `SELECT * FROM \`moves\` WHERE \`key\`="${camelize(name)}";`;
		const queryResult = await fetchSQL(query);
		const embed = getDefaultEmbed();
		if (queryResult.length) {
			const move = queryResult[0];
			if (move.text.length > CHAR_LIMIT) {
				move.text = '\nSorry! Due to Discord\'s embed character limit, I can\'t render this move here. Use the doc link above to access the move text! Apologies for the inconvenience.';
			}
			embed.setTitle(move.title)
				.setDescription(`**${move.tags}**\n${move.text}`)
				.setColor(colorDict[move.color])
				.setURL(getDocLink(docDict[move.doc]));
		} else {
			console.log(`No information found for ${name}.`);
			embed.setDescription(`Sorry, I couldn't find anything for '${name}'.`);
		}
		await interaction.reply({ embeds: [embed] });
	},
};