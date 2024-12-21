const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { colorDict } = require('../utils/info');
const { getDefaultEmbed, titleCase } = require('../utils/stringy');

// Based partially off https://www.blackslate.io/articles/creating-a-discord-bot-using-discord-js

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ministrife')
		.setDescription('Challenge another user to a ministrife!')
		.addUserOption(
			option =>
				option
					.setName('target')
					.setDescription('Who\'re you challenging?')
					.setRequired(true),
		),
	category: 'Fun',
	async execute(interaction) {

		// Define choices
		const choices = {
			'brains': {
				name: 'brains',
				beats: 'brawn',
				emoji: '🧠',
			},
			'brawns': {
				name: 'brawn',
				beats: 'burst',
				emoji: '💪',
			},
			'burst': {
				name: 'burst',
				beats: 'brains',
				emoji: '💥',
			},
		};

		// Ward against bot/self targeting
		const target = interaction.options.getUser('target');
		if (target.bot) {
			await interaction.reply({ content: 'Bots don\'t play these games!', ephemeral: true });
		}
		if (target.id === interaction.user.id) {
			await interaction.reply({ content: 'You can\'t play against yourself!', ephemeral: true });
		}

		// Set up the initial embed
		const embed = getDefaultEmbed()
			.setTitle('Brains, Brawn, Burst!')
			.setDescription(`It's ${interaction.user}'s turn.`)
			.setColor(colorDict.BOT)
			.setTimestamp(new Date());

		const buttons = Object.keys(choices).map(choice => {
			return new ButtonBuilder()
				.setCustomId(`rps_${choices[choice].name}`)
				.setLabel(titleCase(choices[choice].name))
				.setStyle(ButtonStyle.Primary)
				.setEmoji(choices[choice].emoji);
		});

		const row = new ActionRowBuilder().addComponents(buttons);
		const reply = await interaction.reply({
			content: `${target}, you have been challenged! Wait for your challenger to throw before clicking the buttons below.`,
			embeds: [embed],
			components: [row],
		});

		// Set up the initial interaction
		const initialInteraction = await reply
			.awaitMessageComponent({
				filter: i => i.user.id === interaction.user.id,
				time: 300_000,
			})
			.catch(async () => {
				embed.setDescription(`${interaction.user} didn't respond in time.`);
				await reply.edit({ embeds: [embed], components: [] });
			});

		// Acquire and respond to initial throw
		if (!initialInteraction) return;
		const initialThrow = choices[Object.keys(choices).find(
			(choice) => choices[choice].name === initialInteraction.customId.split('_')[1],
		)];
		await initialInteraction.reply({
			content: `You threw ${initialThrow.emoji}!`,
			ephemeral: true,
		});

		// Acquire and respond to target throw
		embed.setDescription(`It's ${target}'s turn.`);
		await reply.edit({ embeds: [embed] });
		const targetInteraction = await reply
			.awaitMessageComponent({
				filter: i => i.user.id === target.id,
				time: 300_000,
			})
			.catch(async () => {
				embed.setDescription(`${target} didn't respond in time.`);
				await reply.edit({ embeds: [embed], components: [] });
			});
		if (!targetInteraction) return;
		const targetThrow = choices[Object.keys(choices).find(
			(choice) => choices[choice].name === targetInteraction.customId.split('_')[1],
		)];

		// Determine the winner
		let result = `If you're reading this, the bot couldn't resolve ${interaction.user}'s throw of ${initialThrow.name} against ${target}'s throw of ${targetThrow.name}.`;
		if (initialThrow.beats === targetThrow.name) {
			result = `${interaction.user} wins!\n ${interaction.user} rolls damage with **[Talent]**, and ${target} rolls damage with **[Inept]**.`;
		}
		if (initialThrow.name === targetThrow.name) {
			result = 'It\'s a tie! Both players roll flat for damage.';
		}
		if (initialThrow.name === targetThrow.beats) {
			result = `${target} wins! ${target} rolls damage with **[Talent]**, and ${interaction.user} rolls damage with **[Inept]**.`;
		}
		embed.setDescription(
			`${target} threw ${targetThrow.emoji} and ${interaction.user} threw ${initialThrow.emoji}.\n\n${result}`,
		);

		// Respond with the result
		reply.edit({ embeds: [embed], components: [] });
	},
};