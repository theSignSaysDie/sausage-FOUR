const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { versionNum, colorDict } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Check the current version of Sausage'),
	async execute(interaction) {
		const embed = getDefaultEmbed()
			.setTitle(`SAUSAGE ${versionNum}`)
			.setColor(colorDict.SAUSAGE_UPDATE)
			.setDescription(`
				**LAST UPDATE:** December 15th, 2021 @ 19:45 EST

                **AUTHORS**: Neo, Meme

                <:robofrog:853005327694561310> **GENERAL UPDATES**
                TODO
            	
                <:robofrog:853005327694561310> **MECHANIC UPDATES**
                TODO`);
		await interaction.reply({ embeds: [embed] });
	},
};