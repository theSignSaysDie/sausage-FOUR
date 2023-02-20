const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, TextInputStyle } = require('discord.js');
const { getDefaultEmbed } = require('../utils/stringy');
const { fetchSQL } = require('../utils/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pinglist')
		.setDescription('Create and manage pinglists')
		.addStringOption(option =>
			option
				.setName('operation')
				.setDescription('What do you want to do?')
				.setRequired(true)
				.addChoices(
					{ name: 'create', value: 'create' },
					{ name: 'invoke', value: 'invoke' },
					{ name: 'delete', value: 'delete' },
				),
		).addStringOption(option =>
			option
				.setName('name')
				.setDescription('Pinglist name')
				.setRequired(true),
		),
	async execute(interaction) {
		console.log('e');
		const name = interaction.options.getString('name').replace(/[^ a-zA-Z?]/, '').toLowerCase();
		const operation = interaction.options.getString('operation');
		const user = interaction.user.id;
		let query, result;

		const buttonRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`pinglist_join_${name}`)
					.setLabel('Join Pinglist')
					.setEmoji('✅')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId(`pinglist_leave_${name}`)
					.setLabel('Leave Pinglist')
					.setEmoji('👋')
					.setStyle(ButtonStyle.Danger),
			);
		const pinglistMessageContents = [buttonRow];

		query = `SELECT * FROM \`pinglist\` WHERE \`snowflake\` = '${user}' AND \`record\` = 'author' AND \`name\` = '${name}';`;
		result = await fetchSQL(query);
		if (!result.length) {
			if (operation === 'create') {
				query = 'INSERT INTO `pinglist` VALUES (?, \'author\', ?)';
				await fetchSQL(query, [user, name]);
				await interaction.reply({ embeds: [getDefaultEmbed().setDescription(`Pinglist \`${name}\` **created**!`)], components: pinglistMessageContents });
			} else {
				await interaction.reply({ content: `You don't seem to have a pinglist under the name '${name}'! Check your spelling and try again.`, ephemeral: true });
			}
		} else if (operation === 'create') {
			await interaction.reply({ content: `It seems like you already have a pinglist named '${name}'!`, ephemeral: true });
		} else if (operation === 'invoke') {
			query = 'SELECT `snowflake` FROM `pinglist` WHERE `record` = \'subscriber\' AND `name` = ?;';
			result = await fetchSQL(query, [name]);
			const userList = result.map(x => `<@${x.snowflake}>`).join(' ');
			await interaction.reply({ content: userList, embeds: [getDefaultEmbed().setDescription(`Pinglist \`${name}\` invoked!\n\nUsers pinged: \`${result.length}\``)], components: pinglistMessageContents });
		} else {
			const modal = new ModalBuilder()
				.setCustomId(`pinglist_remove_${name}`)
				.setTitle(`Remove pinglist '${name}'`);
			modal.addComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId(`pinglist_remove_confirm_${name}`)
						.setLabel('WARNING: IRREVOCABLE ACTION')
						.setPlaceholder(`Type '${name}' verbatim to confirm deletion`)
						.setStyle(TextInputStyle.Short)
						.setRequired(true),
				),
			);
			await interaction.showModal(modal);
		}
	},
};