const { SlashCommandBuilder } = require('discord.js');
const { roll1ToX } = require('../utils/dice');

const delimiters = ';/, ';
module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Choose from a list of choices')
		.addStringOption(
			option =>
				option
					.setName('choices')
					.setDescription('What you\'re picking from')
					.setRequired(true),
		),
	async execute(interaction) {
		const choiceString = interaction.options.getString('choices');
		let choices;
		if (choiceString.indexOf(' ') === -1) {
			await interaction.reply({ content: 'dude.', ephemeral: true });
			return;
		}
		for (const s in delimiters) {
			if (choiceString.indexOf(delimiters[s]) !== -1) {
				choices = choiceString.split(delimiters[s]).map(x => x.trim());
				break;
			}
		}
		await interaction.reply({ content: `Choices: \n${choices.map(x => `- \`${x}\``).join('\n')}\n\nChoice selected: \`${choices[roll1ToX(choices.length) - 1].trim()}\``, ephemeral: true });
	},
};