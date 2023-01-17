const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { fetchSQL } = require('../utils/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trollcall')
		.setDescription('Retrieve a user\'s troll call')
		.addUserOption(option =>
			option
				.setName('username')
				.setDescription('The name of the user whose troll call you want')
				.setRequired(true),
		).addBooleanOption(option =>
			option
				.setName('public')
				.setDescription('Post for everyone else (default: false)')),
	async execute(interaction) {
		const username = interaction.options.getUser('username');
		let public = interaction.options.getBoolean('public');
		if (public === undefined) public = false;
		const query = `SELECT \`docLink\` FROM \`trollcall\` WHERE \`userID\`="${username.id}";`;
		const queryResult = await fetchSQL(query);
		if (queryResult.length) {
			const docLink = queryResult[0].docLink;
			await interaction.reply({ content:docLink, ephemeral: !public });
		} else {
			console.log(`No information found for ${username}.`);
			const embed = new getDefaultEmbed()
				.setDescription(`Sorry, I couldn't find anything for '${username}'.`);
			await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};