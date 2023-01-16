const { SlashCommandBuilder } = require('discord.js');
const { trollFirstNameDict, trollFullNameDict } = require('../utils/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('troll')
		.setDescription('Retrieve troll sheet')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the troll to retrieve')
				.setRequired(true),
		),
	async execute(interaction) {
		const name = interaction.options.getString('name').replace(/[^ a-zA-Z?]/, '').toLowerCase();
		let reply = '';
		if (name.includes(' ')) {
			if (trollFullNameDict[name]) {
				reply = trollFullNameDict[name];
			} else {
				reply = { content: `Sorry, I couldn't find anything for '${name}'.`, ephemeral: true };
			}
		} else if (trollFirstNameDict[name]) {
			reply = trollFirstNameDict[name];
		} else {
			reply = { content: `Sorry, I couldn't find anything for '${name}'.`, ephemeral: true };
		}
		await interaction.reply(reply);
	},
};