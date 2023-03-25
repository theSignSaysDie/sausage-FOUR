const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { helpText } = require('../utils/info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Read the command documentation!')
		.addStringOption(option =>
			option
				.setName('command')
				.setDescription('Fetch specific command documentation')
				.addChoices(
					{ name: 'anon-note', value: 'anon-note' },
					{ name: 'choose', value: 'choose' },
					{ name: 'doc', value: 'doc' },
					{ name: 'help', value: 'help' },
					{ name: 'lookup', value: 'lookup' },
					{ name: 'pinglist', value: 'pinglist' },
					{ name: 'roll', value: 'roll' },
					{ name: 'starter', value: 'starter' },
				).setRequired(false),
		),
	async execute(interaction) {
		const page = interaction.options.getString('command') ?? 'default';
		const returnEmbed = getDefaultEmbed().setDescription(helpText[page]).setTitle('Command Help' + (page === 'default' ? '' : ` [${page}]`));
		await interaction.reply({ embeds: [returnEmbed], ephemeral: true });
	},
};