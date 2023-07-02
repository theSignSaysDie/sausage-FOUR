/* eslint-disable capitalized-comments */
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const path = require('node:path');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cardtest')
		.setDescription('Simple card test command'),
	async execute(interaction) {

		/*
			CONFIGURATION
		*/

		const card_width = 900;
		const card_height = 1200;
		const card_border_offset = 20;
		const card_border_thickness = 16;
		const card_border_color = '#00BB00';
		const card_corner_roundness = 80;
		const bg_grd_start = '#008800';
		const bg_grd_end = '#003300';
		const grd_start = 0.50;

		// Hex svg mask
		const hexes = await Canvas.loadImage(path.join(__dirname, '../cards/assets/hex_final.svg'));
		const bg_hex_start = '#006600';
		const bg_hex_end = '#002200';


		const canvas_hex = Canvas.createCanvas(card_width, card_height);
		const ctx_hex = canvas_hex.getContext('2d');
		ctx_hex.imageSmoothingEnabled = true;

		const canvas = Canvas.createCanvas(card_width, card_height);
		const context = canvas.getContext('2d');

		context.imageSmoothingEnabled = true;

		// Card background gradient
		const grd_base = context.createLinearGradient(0, 0, 0, canvas.height);
		grd_base.addColorStop(0, bg_grd_start);
		grd_base.addColorStop(grd_start, bg_grd_start);
		grd_base.addColorStop(1, bg_grd_end);

		// Card hex gradient
		const grd_hex = ctx_hex.createLinearGradient(0, 0, 0, canvas_hex.height);
		grd_hex.addColorStop(0, bg_hex_start);
		grd_hex.addColorStop(grd_start, bg_hex_start);
		grd_hex.addColorStop(1, bg_hex_end);

		ctx_hex.fillStyle = grd_hex;
		ctx_hex.drawImage(hexes, 0, 0, canvas_hex.width, canvas_hex.height, 0, 0, canvas_hex.width, canvas_hex.height);

		ctx_hex.globalCompositeOperation = 'source-atop';

		ctx_hex.beginPath();
		ctx_hex.fillStyle = grd_hex;
		ctx_hex.fillRect(0, 0, canvas_hex.width, canvas_hex.height);

		// Draw card background
		context.beginPath();
		context.fillStyle = grd_base;
		context.roundRect(0, 0, canvas.width, canvas.height, [card_corner_roundness]);
		context.fill();

		// New drawings only overwrite existing pixels
		context.globalCompositeOperation = 'source-atop';

		context.drawImage(canvas_hex, 0, 0);

		context.globalCompositeOperation = 'source-over';

		context.beginPath();
		context.strokeStyle = card_border_color;
		context.lineWidth = card_border_thickness;
		context.roundRect(card_border_offset, card_border_offset, canvas.width - card_border_offset * 2, canvas.height - card_border_offset * 2, [card_corner_roundness - card_border_offset]);
		context.stroke();

		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'test.png' });
		await interaction.reply({ files: [attachment] });
	},
};