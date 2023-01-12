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
				**LAST UPDATE:** December 15th, 2021 @ 19:45 EST\n
                **AUTHOR**: Neo\n\n
                <:robofrog:853005327694561310> **GENERAL UPDATES**\n\n
                The troll whitelist is now added to the fanmade docs.\n\n
            	<:robofrog:853005327694561310> **MECHANIC UPDATES**\n
                The following things have been updated to match the versions on the docs.\n\n
                Psimates (Mutants)\n
                Gobblefiend (Monsters)\n
                Mutagenic Adaptation (Violet)\n
                Neighborhood Watch Doc & Moves Added\n
                Orthodox Decompositionist Doc & Moves Added\n
                Scalemates (Precaptchalogues)\n
                Recharge (Tag)\n
                Peaceful (Emotion)\n
                Serene (Emotion)\n\n
				<:robofrog:853005327694561310> **REMINDERS**\n\n
                Doing ?tipjar brings up the ko-fi's and paypal's of the creators! We appreciate any tips, as we make no money off the upkeep of Sausage. \n
                You may notice some moves are formatted differently from others. We are in the process of changing the formatting of moves within Sausage!
                Moves will be changed over to the new layout as they are patched, or by bulk when one of the devs has the time.
			`);
		await interaction.reply({ embeds: [embed] });
	},
};