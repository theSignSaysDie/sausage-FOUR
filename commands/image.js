const { SlashCommandBuilder } = require('discord.js');
const { dictList } = require('../utils/stringy');
const { roll1ToX } = require('../utils/dice');
const fs = require('node:fs');
const path = require('node:path');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription('Retrieve a random image from a category')
		.addStringOption(
			option =>
				option
					.setName('category')
					.setDescription('image category')
					.setRequired(true)
					.addChoices(
						...dictList(fs.readdirSync('./img/')),
					),
		),
	async execute(interaction) {
		const category = interaction.options.getString('category');
		const files = fs.readdirSync(`./img/${category}/`);
		const targetFile = files[roll1ToX(files.length) - 1];
		await interaction.reply({ files: [path.join(__dirname, `../img/${category}/${targetFile}`)] });
	},
};