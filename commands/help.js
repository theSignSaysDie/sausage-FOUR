const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { helpText } = require('../utils/info');
const { easyListItems } = require('../utils/math');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Read the command documentation!')
		.addStringOption(option =>
			option
				.setName('command')
				.setDescription('Fetch specific command documentation')
				.addChoices(
					...easyListItems(['anon-note', 'choose', 'doc', 'help', 'lookup', 'pinglist', 'poll', 'roll', 'starter']),
				).setRequired(false),
		),
	async execute(interaction) {
		const page = interaction.options.getString('command') ?? 'default';
		const returnEmbed = getDefaultEmbed().setDescription(helpText[page]).setTitle('Command Help' + (page === 'default' ? '' : ` [${page}]`));
		await interaction.reply({ embeds: [returnEmbed], ephemeral: true });
	},
};