const { SlashCommandBuilder } = require('discord.js');
const { birthdays } = require('../utils/info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birthdaybeam')
		.setDescription('Woe. Cake be upon ye')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Who\'s it gonna be?'),
		).setDefaultMemberPermissions(0),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		birthdays.push(target.id);
		setTimeout(() => {
			const index = birthdays.indexOf(target.id);
			if (index > -1) {
				birthdays.splice(index, 1);
			}
			console.log(`${target.username} has been de-beamed.`);
		}, 64800000);
		// 18 hours
		await interaction.reply({ content: `\`${target.username}#${target.discriminator}\` has been **birthday beamed**! Bring on the 🍰 reacts!`, ephemeral: false });
	},
};
