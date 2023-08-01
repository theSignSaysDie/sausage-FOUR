const { Events } = require('discord.js');
const { colorDict } = require('../utils/info');
const { getDefaultEmbed } = require('../utils/stringy');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isButton()) return;
		const id = interaction.customId;
		if (id.startsWith('callout_')) {
			const details = id.replace('callout_', '').split('_');
			const [lie, truth] = details;
			const true_or_lie_embed = getDefaultEmbed()
				.setDescription(`🎲 Roll result: ${lie} (${lie === truth ? '**TRUTH!**' : `**LIE!** Actual: ${truth}`})`)
				.setColor(lie === truth ? colorDict.LIME : colorDict.RUST);
			await interaction.message.edit({ embeds: [true_or_lie_embed], components: [] });
		} else if (id.startsWith('alright_')) {
			await interaction.message.edit({ components: [] });
		}
	},
};