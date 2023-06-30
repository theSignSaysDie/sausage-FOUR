const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const path = require('node:path');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cardtest')
		.setDescription('Simple card test command'),
	async execute(interaction) {
		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage(path.join(__dirname, '../cards/image.png'));
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		context.strokeStyle = '#00FF00';
		context.strokeRect(0, 0, canvas.width, canvas.height);
		// Console.log(Canvas.GlobalFonts.families);
		context.font = 'bold 16px Courier New';
		context.fillStyle = '#000000';
		context.fillText('how do i rotate text in @napi-rs/canvas', canvas.width * 0.4, canvas.height / 2);
		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'the-image.png' });
		await interaction.reply({ files: [attachment] });
	},
};