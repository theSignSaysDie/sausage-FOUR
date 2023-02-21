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

                **AUTHORS**: <@308760900016537610>, <@315220045141770241>

                <:robofrog:853005327694561310> **GENERAL UPDATES**
                - Migrated pre-existing functionality to \`/\` slash commands for more power and flexibility (and to avoid getting bonked by Discord API obsolescence)
				- Added \`/lookup\` - replaces \`move\`, \`status\`, and similar commands
				- Improved \`/trollcall\` - Troll Calls can now be registered per user and fetched by anyone
				- Added \`/starter\` - Trollcial post templates (intro, post, and outro) can be registered and retrieved by troll for easier trolling on mobile
				- Added \`/pinglist\` - Pinglists can now be registered by user and joined/left without needing to bother the owner
				- Added \`/roll\` - Sausage can roll dice now, and uses an even better random generator than Avrae does
				- Added \`/choose\` - just a bit better than Clamkiller's
            	
                <:robofrog:853005327694561310> **MECHANIC UPDATES**
				- None! Game info is no longer hard-coded and can be patched without rebooting Sausage!`);
		await interaction.reply({ embeds: [embed], allowedMentions: { users: [] } });
	},
};