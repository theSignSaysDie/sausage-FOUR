const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchSQL } = require('../utils/lookup');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trollcall')
		.setDescription('Retrieve a user\'s troll call')
		.addUserOption(option =>
			option.setName('username')
				.setDescription('The name of the user whose troll call you want')
				.setRequired(true),
		),
	async execute(interaction) {
		const username = interaction.options.getUser('username');
		console.log(Object.keys(username));
		const query = `SELECT \`docLink\` FROM \`troll_call\` WHERE \`userID\`="${username.id}";`;
		const queryResult = await fetchSQL(query);

		if (queryResult.length) {
			const docLink = queryResult[0].docLink;
			interaction.reply({ content:docLink, ephemeral: true });
		} else {
			console.log(`No information found for ${username}.`);
			const embed = new EmbedBuilder()
				.setDescription(`Sorry, I couldn't find anything for '${username}'.`);
			await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};