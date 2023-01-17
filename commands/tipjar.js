const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { colorDict } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tipjar')
		.setDescription('Tip the devs!'),
	async execute(interaction) {
		const rowNeo = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Neo\'s Paypal')
					.setStyle(ButtonStyle.Link)
					.setURL('https://paypal.me/ashenGemstone'),
				new ButtonBuilder()
					.setLabel('Neo\'s Ko-Fi')
					.setStyle(ButtonStyle.Link)
					.setURL('https://ko-fi.com/neonova'),
			);
		const rowErika = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Erika\'s Paypal')
					.setStyle(ButtonStyle.Link)
					.setURL('https://paypal.me/am326'),
				new ButtonBuilder()
					.setLabel('Erika\'s Ko-Fi')
					.setStyle(ButtonStyle.Link)
					.setURL('https://ko-fi.com/am3_26'),
			);
		const rowMeme = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Meme\'s Paypal')
					.setStyle(ButtonStyle.Link)
					.setURL('https://paypal.me/DTAngres'),
				new ButtonBuilder()
					.setLabel('Meme\'s Ko-Fi')
					.setStyle(ButtonStyle.Link)
					.setURL('https://ko-fi.com/mememagician'),
			);
		const embed = getDefaultEmbed()
			.setTitle('TIP JAR')
			.setColor(colorDict.SAUSAGE_UPDATE)
			.setDescription('Hello and welcome to the Developers Tip Jar! Do not feel obligated to donate - but if you do, we appreciate it, because keeping Sausage up and running is wholly volunteer work!');
		await interaction.reply({ embeds: [embed], components: [rowNeo, rowErika, rowMeme], ephemeral: true });
	},
};