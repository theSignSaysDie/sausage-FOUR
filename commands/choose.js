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
		).addBooleanOption(
			option =>
				option
					.setName('secret')
					.setDescription('Wanna be sneaky?')
					.setRequired(false),
		).addIntegerOption(
			option =>
				option
					.setName('pick')
					.setDescription('How many choices?')
					.setRequired(false),
		),
	async execute(interaction) {
		const choiceString = interaction.options.getString('choices');
		const secrecy = interaction.options.getBoolean('secret') ?? false;
		const pick = interaction.options.getInteger('pick') ?? 1;
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

		if (choices.length <= pick) {
			await interaction.reply({ content: `You can't pick ${pick} choices from a list ${choices.length} elements long.`, ephemeral: true });
			return;
		} else if (pick <= 0) {
			await interaction.reply({ content: `You can't pick ${pick} choices from a list.`, ephemeral: true });
		}

		const choiceList = choices.map(x => `- \`${x}\``).join('\n');

		const result = [];
		while (pick > result.length) {
			const select = roll1ToX(choices.length) - 1;
			console.log(select);
			result.push(choices[select].trim());
			choices.splice(select, 1);
		}

		await interaction.reply({ content: `Choices: \n${choiceList}\n\nChoice${ pick !== 1 ? 's' : '' } selected: \`${result.join(', ')}\``, ephemeral: secrecy });
	},
};