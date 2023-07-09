const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { formatRoll, modStr, getRollColor, formatRawRoll } = require('../utils/dice');
const { colorDict } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll some dice')
		.addStringOption(option =>
			option.setName('raw')
				.setDescription('Enter a manual diceroll'),
		).addIntegerOption(option =>
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
		const raw = interaction.options.getString('raw');
		const description = interaction.options.getString('description') || 'Roll result';
		if (raw) {
			let m;
			const lie_regex = /lie ([^ ]+) ([^ ]+)/;
			const regex = /(\d+)?d(\d+)(?:k([lh])(\d+))?(?:([+-])(\d+))?/;
			const timestamp = Date.now();
			if ((m = lie_regex.exec(raw)) !== null) {
				const embed = getDefaultEmbed()
					.setTitle(`**${description}**`)
					.setDescription(`🎲 Roll result: ${m[1]}`)
					.setColor(colorDict.LIME);
				const calloutButton = new ButtonBuilder()
					.setCustomId(`callout_${m[1]}_${m[2]}_${timestamp}`)
					.setLabel('BS!')
					.setEmoji('📢')
					.setStyle(ButtonStyle.Danger);
				const okayButton = new ButtonBuilder()
					.setCustomId(`alright_${m[1]}_${m[2]}_${timestamp}`)
					.setLabel('Alright')
					.setEmoji('✅')
					.setStyle(ButtonStyle.Primary);
				const row = new ActionRowBuilder()
					.addComponents(okayButton, calloutButton);

				const response = await interaction.reply({ embeds: [embed], components: [row] });
				try {
					const confirmation = await response.awaitMessageComponent({ time: 60_000 });
					if (confirmation.customId.startsWith('callout')) {
						const true_or_lie_embed = getDefaultEmbed()
							.setTitle(`**${description}**`)
							.setDescription(`🎲 Roll result: ${m[1]} (${m[1] === m[2] ? '**TRUTH!**' : `**LIE!** Actual: ${m[2]}`})`)
							.setColor(m[1] === m[2] ? colorDict.LIME : colorDict.RUST);
						await confirmation.update({ embeds: [true_or_lie_embed], components: [] });
					} else if (confirmation.customId.startsWith('alright')) {
						await confirmation.update({ components: [] });
					}
				} catch (e) {
					await interaction.editReply({ content: `Something broke. ${m[1]} ${m[2]}`, components: [] });
				}
			} else if ((m = regex.exec(raw)) !== null) {
				const amt = +(m[1] ?? 1);
				const size = +m[2];
				const keeps = m[3] ? (m[3] === 'h' ? +m[4] : -m[4]) : 0;
				if (Math.abs(keeps) > amt) {
					await interaction.reply({ content: `I'm sorry! I couldn't parse the roll \`${raw}\` because you're trying to keep more dice than you're rolling. Please double-check your spelling and try again.`, ephemeral: true });
					return;
				}
				if (m[3] && keeps === 0) {
					await interaction.reply({ content: '...Why are you keeping zero dice? Please try again.', ephemeral: true });
					return;
				}
				const mod = m[5] ? eval(`${m[5]}${m[6]}`) : 0;
				const rollInfo = formatRawRoll(amt, size, keeps, mod);
				const embed = getDefaultEmbed()
					.setTitle(`**${description}**`)
					.setDescription(`${m[0]}\n\n🎲 ${rollInfo.text}`)
					.setColor(colorDict.GREY);
				await interaction.reply({ embeds: [embed] });
			} else {
				await interaction.reply({ content: `I'm sorry! I couldn't parse the roll \`${raw}\`. Please double-check your spelling and try again.`, ephemeral: true });
			}
		} else {
			const dice = interaction.options.getInteger('dice') || 8;
			const modifier = interaction.options.getInteger('modifier') || 0;
			const talent = interaction.options.getInteger('talent') || 0;
			const talentName = ['godawful', 'inept', '', 'talented', 'legendary'];
			const metagamerModifier = (dice === 8) ? '' : ` [\`${{ 10: '1d6+1d10', 4: '4d4', 2: '8d2' }[dice]}\`]`;
			const diceString = (talent === 0 && modifier === 0 && dice === 8) ? '' : ` (${dice === 2 ? '' : talentName[talent + 2]}${(talent !== 0 && modifier !== 0) ? ' ' : ''}${dice === 2 ? '' : modStr(modifier)}${metagamerModifier})`;
			const rollInfo = formatRoll(dice, talent, modifier);
			const embed = getDefaultEmbed()
				.setTitle(`**${description}**`)
				.setDescription(`${diceString}\n\n🎲 ${rollInfo.text}`)
				.setColor(getRollColor(rollInfo));
			await interaction.reply({ embeds: [embed] });
		}
	},
};