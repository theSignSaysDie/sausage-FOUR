const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		const id = interaction.customId;
		if (id.startsWith('banModal_')) {
			const [target, disc] = id.replace('banModal_', '').split('_');
			const messageText = interaction.fields.getTextInputValue(`banModalJustification_${target}`);
			console.log(`-----\n${messageText}\n-----`);
			const banConfirm = interaction.fields.getTextInputValue(`banModalConfirmation_${target}`);
			if (banConfirm === disc) {
				console.log('Fetching user...');
				const user = await interaction.guild.members.fetch(target);
				console.log('Sending message...');
				await user.send(messageText);
				console.log('Banning user...');
				await interaction.guild.members.ban(target);
				console.log('All done!');
				await interaction.reply({ content: 'Target eliminated.', ephemeral: true });
			} else {
				await interaction.reply({ content: 'Sorry, the ban command was not successful. Make sure you confirmed it properly.', ephemeral: true });
			}
		}
	},
};