const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { fetchSQL } = require('../utils/db');
const { camelize, dictList } = require('../utils/stringy');
const { tableNames } = require('../utils/info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patch')
		.setDescription('Perform live edits to the rules database')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a new entry to the database')
				.addStringOption(option =>
					option
						.setName('table')
						.setDescription('Table you want to add an entry to')
						.setRequired(true)
						.setChoices(
							...dictList(tableNames),
						),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('Edit an existing entry in the database')
				.addStringOption(option =>
					option
						.setName('table')
						.setDescription('Table whose entry you want to edit')
						.setRequired(true)
						.setChoices(
							...dictList(tableNames),
						),
				).addStringOption(option =>
					option
						.setName('key')
						.setDescription('Key of entry you want to edit')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('drop')
				.setDescription('Remove an existing entry in the database')
				.addStringOption(option =>
					option
						.setName('table')
						.setDescription('Table whose entry you want to remove')
						.setRequired(true)
						.setChoices(
							...dictList(tableNames),
						),
				).addStringOption(option =>
					option
						.setName('key')
						.setDescription('Key of entry you want to remove')
						.setRequired(true),
				),
		).setDefaultMemberPermissions(0),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			const table = camelize(interaction.options.getString('table'));
			const query = `SHOW COLUMNS FROM \`${table}\``;
			const queryResult = await fetchSQL(query);
			const modal = new ModalBuilder()
				.setCustomId(`patchAddModal_${table}`)
				.setTitle(`Enter new entry for ${table}`);
			for (const item of queryResult) {
				const actionRow = new ActionRowBuilder();
				const label = item['Field'];
				if (label === 'key') continue;
				const textBox = new TextInputBuilder()
					.setCustomId(`patchAddTextInput_${table}_${label}`)
					.setLabel(`Enter ${label}`)
					.setRequired(true);
				if (label === 'text') {
					textBox
						.setStyle(TextInputStyle.Paragraph)
						.setMinLength(0)
						.setMaxLength(4000);
				} else {
					textBox.setStyle(TextInputStyle.Short);
				}
				actionRow.addComponents(textBox);
				modal.addComponents(actionRow);
			}
			await interaction.showModal(modal);
		} else if (interaction.options.getSubcommand() === 'edit') {
			const table = camelize(interaction.options.getString('table'));
			const key = camelize(interaction.options.getString('key'));
			let query = `SELECT 1 FROM ${table} WHERE \`key\` = '${key}';`;
			let queryResult = await fetchSQL(query);
			if (queryResult.length) {
				query = `SHOW COLUMNS FROM \`${table}\``;
				queryResult = await fetchSQL(query);
				const buttons = new ActionRowBuilder();
				for (const item of queryResult) {
					const label = item['Field'];
					if (label === 'key') continue;
					buttons.addComponents(
						new ButtonBuilder()
							.setCustomId(`patchEditButton_${table}_${key}_${label}`)
							.setLabel(label)
							.setStyle(ButtonStyle.Primary),
					);
				}
				await interaction.reply({ components: [buttons], ephemeral: true });
			} else {
				await interaction.reply({ content: `Sorry, I couldn't find anything for key '${key}' in table '${table}'. Check your spelling and try again!`, ephemeral: true });
			}
		} else if (interaction.options.getSubcommand() === 'drop') {
			const table = camelize(interaction.options.getString('table'));
			let key = camelize(interaction.options.getString('key'));
			const query = `SELECT \`key\` FROM ${table} WHERE \`key\` = "${key}";`;
			const queryResult = await fetchSQL(query);
			if (queryResult.length) {
				key = queryResult[0]['key'];
				const modal = new ModalBuilder()
					.setCustomId(`patchDropModal_${table}_${key}`)
					.setTitle(`Delete ${table} : ${key}`);
				const actionRow = new ActionRowBuilder();
				const textBox = new TextInputBuilder()
					.setCustomId(`patchDropTextInput_${table}_${key}`)
					.setLabel('WARNING: IRREVOCABLE ACTION')
					.setPlaceholder(`Type '${key}' verbatim to confirm deletion`)
					.setStyle(TextInputStyle.Short)
					.setRequired(true);
				actionRow.addComponents(textBox);
				modal.addComponents(actionRow);
				await interaction.showModal(modal);
			} else {
				await interaction.reply({ content: `Sorry, I couldn't find anything for key '${key}' in table '${table}'. Check your spelling and try again!`, ephemeral: true });
			}
		}
	},
};