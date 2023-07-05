const { SlashCommandBuilder } = require('discord.js');
const emojiRegex = require('emoji-regex');
const { getDefaultEmbed } = require('../utils/stringy');
const { makeRelativeTimestamp } = require('../utils/time');
const { zip } = require('../utils/math');
const { afterEach } = require('node:test');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Set up a poll!')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('What\'s the poll for?')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('choices')
				.setDescription('Add choices (ex. 🍎Apple; 🍌Banana)')
				.setRequired(true),
		).addIntegerOption(option =>
			option.setName('time')
				.setDescription('Enter poll duration')
				.addChoices(
					{ name: '10m', value: 10 },
					{ name: '30m', value: 30 },
					{ name: '1hr', value: 60 },
					{ name: '4hr', value: 240 },
					{ name: '24hr', value: 1440 },
				)
				.setRequired(true),
		),
	async execute(interaction) {

		const rawTime = interaction.options.getInteger('time');
		const rawChoices = interaction.options.getString('choices');
		const title = interaction.options.getString('title');
		const channelID = await interaction.client.channels.cache.get(interaction.channelId);
		const regex = emojiRegex();
		const matches = Array.from(rawChoices.matchAll(regex));
		const emoji = matches.map(x => x[0]);
		const choicesList = rawChoices.split(regex).slice(1).map(x => x.trim());
		console.log(choicesList);
		const choices = zip(emoji, choicesList);
		const timestamp = await makeRelativeTimestamp(rawTime * 60 * 1000);

		const embed = getDefaultEmbed()
			.setDescription(`# ${title}\nEnding ${timestamp}.\n\n${choices.map(x => `${x[0]} ${x[1]}`).join('\n')}`);
		const message = await interaction.reply({ embeds: [embed], fetchReply: true });
		try {
			console.log(emoji);
			for (const i in emoji) {
				console.log(emoji[i]);
				await message.react(emoji[i]);
			}
		} catch (error) {
			console.log(`Fuck! I can\'t react!:  ${error}`);
		}
	},
};