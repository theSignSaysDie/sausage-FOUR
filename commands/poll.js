/* eslint-disable capitalized-comments */
const { SlashCommandBuilder } = require('discord.js');
const emojiRegex = require('emoji-regex');
const { getDefaultEmbed } = require('../utils/stringy');
const { makeRelativeTimestamp } = require('../utils/time');
const { zip } = require('../utils/math');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Set up a poll!')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('What\'s the poll for?')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('description')
				.setDescription('A little lore. As a treat')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('choices')
				.setDescription('Add choices (ex. 🍎Apple; 🍌Banana)')
				.setRequired(true),
		).addIntegerOption(option =>
			option.setName('time')
				.setDescription('Enter poll duration')
				.addChoices(
					{ name: '1m', value: 1 },
					{ name: '10m', value: 10 },
					{ name: '30m', value: 30 },
					{ name: '1hr', value: 60 },
					{ name: '4hr', value: 240 },
					{ name: '12hr', value: 720 },
					{ name: '24hr', value: 1440 },
				)
				.setRequired(true),
		).addBooleanOption(option =>
			option.setName('multiple-responses')
				.setDescription('Are users allowed to vote for multiple options? Default: False')
				.setRequired(false),
		),
	async execute(interaction) {
		// Setup
		// Time conversion from seconds to milliseconds
		const rawTime = interaction.options.getInteger('time') * 60 * 1000;
		const description = interaction.options.getString('description');
		const rawChoices = interaction.options.getString('choices');
		const title = interaction.options.getString('title');
		const multipleResponses = interaction.options.getBoolean('multiple-responses') ?? false;
		const channel = await interaction.client.channels.cache.get(interaction.channelId);
		const regex = emojiRegex();
		const matches = Array.from(rawChoices.matchAll(regex));
		const emoji = matches.map(x => x[0]);
		const choicesList = rawChoices.split(regex).slice(1).map(x => x.trim());
		const choices = zip(emoji, choicesList);

		// Initial message
		const waitEmbed = getDefaultEmbed()
			.setDescription('🐸💬 Please wait while I set up the poll...');

		// React population
		const message = await interaction.reply({ embeds: [waitEmbed], fetchReply: true });
		try {
			for (const i in emoji) { await message.react(emoji[i]);	}
		} catch (error) {
			console.log(`Error attaching reacts to poll:  ${error}`);
		}
		const collectorFilter = (reaction, user) => {
			return !user.bot;
		};
		const whoReacted = {};
		const emojiCollector = message.createReactionCollector({ filter: collectorFilter, time: rawTime });
		if (!multipleResponses) {
			emojiCollector.on('collect', (reaction, user) => {
				whoReacted[user.tag] = reaction.emoji.name;
			});
		}
		emojiCollector.on('end', async () => {
			try {
				const reactCounts = {};
				let maxVotes = -1;
				if (multipleResponses) {
					for (const e of emoji) {
						reactCounts[e] = message.reactions.cache.get(e).count - 1;
						if (reactCounts[e] > maxVotes) {
							maxVotes = reactCounts[e];
						}
					}
				} else {
					for (const e of Object.values(whoReacted)) {
						reactCounts[e] = reactCounts[e] ? reactCounts[e] + 1 : 1;
						if (reactCounts[e] > maxVotes) {
							maxVotes = reactCounts[e];
						}
					}
				}

				message.reactions.removeAll()
					.catch(error => console.error('Failed to clear reactions:', error));
				const resultEmbed = getDefaultEmbed()
					.setDescription(`# ${title}\nPoll closed!\n\n${description}\n\n${choices.map(x => `${(reactCounts[x[0]] ?? 0) === maxVotes ? '**' : ''}${x[0]} ${x[1]} (${reactCounts[x[0]] ?? 0} vote${(reactCounts[x[0]] ?? 0) === 1 ? '' : 's'})${(reactCounts[x[0]] ?? 0) === maxVotes ? '**' : ''}`).join('\n')}`);
				await message.delete();
				await channel.send({ embeds: [resultEmbed] });
			} catch (DiscordjsError) {
				console.log(`Something went wrong attempting to close the poll ${title}. Does the original message still exist?`);
			}
		});


		// Display actual poll
		const timestamp = await makeRelativeTimestamp(rawTime);
		const pollEmbed = getDefaultEmbed()
			.setDescription(`# ${title}\nEnding ${timestamp}.\n\n${description}\n\n**${multipleResponses ? 'Multiple' : 'Single'} Response**\n${choices.map(x => `${x[0]} ${x[1]}`).join('\n')}`);
		await interaction.editReply({ embeds: [pollEmbed] });
	},
};