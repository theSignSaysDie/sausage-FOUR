const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { colorDict } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tipjar')
		.setDescription('Tip the devs!'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('TIP JAR')
			.setColor(colorDict.SAUSAGE_UPDATE)
			.setDescription(`› **Neo**'s Paypal can be found here: <http://paypal.me/ashenGemstone>\n
                        › **Neo**'s Ko-Fi is found here: <https://ko-fi.com/neonova>\n\n
                        › You can buy **Erika** coffee here: <https://ko-fi.com/am3_26> ☕\n
                          or maybe just straight up send me some money? <http://paypal.me/am326>`);
		await interaction.reply({ embeds: [embed] });
	},
};