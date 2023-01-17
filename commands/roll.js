const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { formatRoll, modStr, getRollColor } = require('../utils/dice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll some dice')
		.addIntegerOption(option =>
			option.setName('talent')
				.setDescription('Specify Talent (default normal)')
				.addChoices(
					{ name: '😐 normal',	value: 0 },
					{ name: '🙂 talented', value: 1 },
					{ name: '😃 legendary',	value: 2 },
					{ name: '🙁 inept',	value: -1 },
					{ name: '😧 godawful', value: -2 },
				),
		).addIntegerOption(option =>
			option.setName('modifier')
				.setDescription('Specify modifier (default: +0)'),
		).addStringOption(option =>
			option.setName('description')
				.setDescription('Flavor text for your roll'),
		).addIntegerOption(option =>
			option.setName('dice')
				.setDescription('🎲 FOR [METAGAMERS] ONLY 🎲')
				.addChoices(
					{ name: '2d8', value: 8 },
					{ name: '4d4', value: 4 },
					{ name: '1d6+1d10',	value: 10 },
					{ name: '8d2', value: 2 }),
		),
	async execute(interaction) {
		const dice = interaction.options.getInteger('dice') || 8;
		const modifier = interaction.options.getInteger('modifier') || 0;
		const talent = interaction.options.getInteger('talent') || 0;
		const description = interaction.options.getString('description') || 'Roll result';

		const talentName = ['godawful', 'inept', '', 'talented', 'legendary'];
		const metagamerModifier = (dice === 8) ? '' : ` [\`${{ 10: '1d6+1d10', 4: '4d4', 2: '8d2' }[dice]}\`]`;
		const diceString = (talent === 0 && modifier === 0 && dice === 8) ? '' : ` (${dice === 2 ? '' : talentName[talent + 2]}${(talent !== 0 && modifier !== 0) ? ' ' : ''}${dice === 2 ? '' : modStr(modifier)}${metagamerModifier})`;
		const rollInfo = formatRoll(dice, talent, modifier);
		const embed = getDefaultEmbed()
			.setTitle(`**${description}**`)
			.setDescription(`${diceString}\n\n🎲 ${rollInfo.text}`)
			.setColor(getRollColor(rollInfo));
		await interaction.reply({ embeds: [embed] });

	},
};