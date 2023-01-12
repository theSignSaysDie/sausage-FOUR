const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { colorDict } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Review the server rules'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(colorDict.SAUSAGE_UPDATE)
			.setDescription(`
			RULES\n\n
			1. Play Nice - Don't shittalk people, interests, or be cruel IC without permission. \n\n
			2. Play Fair - Don't cheat in fights. What you roll is what you get.\n\n
			3. Play Safe - Be careful with topics. Some can affect other people more than they affect you.\n\n
			4. Play Fun - Make sure all players are having fun. Don't make people uncomfortable!\n\n
			5. Keep the Setting Integrity in Mind - Alternia is a darker setting where death and hemoism are very real things.
				If something isn't realistic, then don't do it. There can be consequences for characters, 
				since breaking the setting is unfair for those who play the setting correctly.\n\n
			6. Blacklist - Keep topics on the blacklist in mind! Those are listed in #blacklist.
		`);
		await interaction.reply({ embeds: [embed] });
	},
};