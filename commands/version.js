const { SlashCommandBuilder } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { versionNum, colorDict, lastUpdated } = require('../utils/info');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Check the current version of Sausage'),
	async execute(interaction) {
		const embed = getDefaultEmbed()
			.setTitle(`SAUSAGE ${versionNum}`)
			.setColor(colorDict.SAUSAGE_UPDATE)
			.setDescription(`
				**LAST UPDATE:** ${lastUpdated.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).replace('at', '@')}

                **AUTHORS**: Neo, Meme

                <:robofrog:853005327694561310> **GENERAL UPDATES**
                TODO
            	
                <:robofrog:853005327694561310> **MECHANIC UPDATES**
                TODO`);
		await interaction.reply({ embeds: [embed] });
	},
};