const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { fetchSQL } = require('../utils/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pinglists')
		.setDescription('View all your pinglists'),
	async execute(interaction) {
		const user = interaction.user.id;
		const query = 'SELECT `name`, COUNT(*) AS `count` FROM `pinglist` WHERE `name` IN (SELECT `name` FROM `pinglist` WHERE `snowflake` = ? AND `record` = "author") GROUP BY `name`';
		const result = await fetchSQL(query, [user]);
		const embed = getDefaultEmbed();

		if (!result.length) {
			embed.setDescription('Looks like you don\'t have any pinglists! You can make one using `/pinglist create name`!');
		} else {
			embed.setDescription('You have the following pinglists:\n' + result.map(x => `- \`${x.name}\` (**${x.count - 1}** subscriber${(x.count - 1 === 1 ? '' : 's')})`).join('\n'));
		}
		interaction.reply({ embeds: [embed] });
	},
};