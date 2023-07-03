// Const Canvas = require('@napi-rs/canvas');
const { zip } = require('./math');
const Canvas = require('@napi-rs/canvas');
const path = require('node:path');

const GradientAlignment = {
	VERTICAL: 'vertical',
	HORIZONTAL: 'horizontal',
};

const CARD_WIDTH = 900;
const CARD_HEIGHT = 1200;

/**
 * @param {Canvas.SKRSContext2D} ctx The context to which the gradient belongs
 * @param {Canvas.Canvas} canvas The canvas upon which the gradient is drawn
 * @param {GradientAlignment} align The alignment of the gradient (assumed to be the size of the image)
 * @param {Array} stops A dictionary of stops on interval [0, 1] and their corresponding colors
*/
function makeGradient(ctx, canvas, align, stop_points, stop_colors) {
	const grd = ctx.createLinearGradient(0, 0, canvas.width * (align === GradientAlignment.HORIZONTAL), canvas.height * (align === GradientAlignment.VERTICAL));
	for (const i of zip(stop_points, stop_colors)) {
		grd.addColorStop(...i);
	}
	return grd;
}

async function generateCard() {
	/*
			CONFIGURATION
		*/

	const card_name = 'Banansa';
	const card_border_offset = 20;
	const card_border_thickness = 16;
	const card_border_color = '#00BB00';
	const card_corner_roundness = 80;
	const bg_grd_start = '#008800';
	const bg_grd_end = '#003300';
	const bg_hex_start = '#006600';
	const bg_hex_end = '#002200';
	const grd_start = 0.50;
	const art_size_x = 700;
	const art_size_y = 850;
	const art_top = 100;
	const art_offset_x = 0;
	const art_offset_y = 0;
	const art_scale = 3;
	const card_art_border_thickness = 20;
	const card_art_border_color = '#00BB00';
	const drop_shadow_blur = 15;
	const drop_shadow_color = '#000000';
	const vert_info_space = 50;
	const info_height = 100;
	const info_corner_roundness = 25;
	const text_font_size = 50;
	const text_format = `bold ${text_font_size}px Courier New`;
	const nameplate_width = art_size_x - vert_info_space - info_height;
	const max_text_width = nameplate_width - card_border_thickness * 4;

	// Hex svg mask
	const hexes = await Canvas.loadImage(path.join(__dirname, '../cards/assets/hex_final.svg'));
	const sns_logo = await Canvas.loadImage(path.join(__dirname, '../cards/assets/sns.png'));

	// Hex background layer
	const canvas_hex = Canvas.createCanvas(CARD_WIDTH, CARD_HEIGHT);
	const ctx_hex = canvas_hex.getContext('2d');
	ctx_hex.imageSmoothingEnabled = true;

	// Infoboxes layer
	const canvas_info = Canvas.createCanvas(CARD_WIDTH, CARD_HEIGHT);
	const ctx_info = canvas_info.getContext('2d');
	ctx_info.imageSmoothingEnabled = true;
	ctx_info.textAlign = 'center';

	// Logo layer
	const canvas_noshadow = Canvas.createCanvas(CARD_WIDTH, CARD_HEIGHT);
	const ctx_noshadow = canvas_noshadow.getContext('2d');
	ctx_noshadow.imageSmoothingEnabled = true;

	// Final layer
	const canvas = Canvas.createCanvas(CARD_WIDTH, CARD_HEIGHT);
	const context = canvas.getContext('2d');
	context.imageSmoothingEnabled = true;

	// Card background gradient
	const grd_base = makeGradient(context, canvas, 'vertical', [0, grd_start, 1], [bg_grd_start, bg_grd_start, bg_grd_end]);

	// Card hex gradient
	const grd_hex = makeGradient(ctx_hex, canvas_hex, 'vertical', [0, grd_start, 1], [bg_hex_start, bg_hex_start, bg_hex_end]);

	// Draw hexes with gradient
	ctx_hex.fillStyle = grd_hex;
	ctx_hex.drawImage(hexes, 0, 0, canvas_hex.width, canvas_hex.height, 0, 0, canvas_hex.width, canvas_hex.height);

	ctx_hex.globalCompositeOperation = 'source-atop';

	ctx_hex.beginPath();
	ctx_hex.fillRect(0, 0, canvas_hex.width, canvas_hex.height);
	ctx_hex.closePath();

	// Draw card background
	context.beginPath();
	context.fillStyle = grd_base;
	context.roundRect(0, 0, canvas.width, canvas.height, [card_corner_roundness]);
	context.fill();
	context.closePath();

	// Decorative border
	ctx_info.fillStyle = 'rgba(0, 0, 0, 0)';
	ctx_info.beginPath();
	ctx_info.strokeStyle = card_border_color;
	ctx_info.lineWidth = card_border_thickness;
	ctx_info.save();
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.roundRect(
		card_border_offset, card_border_offset, canvas_info.width - card_border_offset * 2, canvas_info.height - card_border_offset * 2,
		[card_corner_roundness - card_border_offset]);
	ctx_info.stroke();
	ctx_info.closePath();
	ctx_info.restore();

	// Make border for card art
	ctx_info.globalCompositeOperation = 'source-over';
	ctx_info.beginPath();
	ctx_info.strokeStyle = card_art_border_color;
	ctx_info.save();
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.lineWidth = card_art_border_thickness;
	ctx_info.fillStyle = 'none';
	ctx_info.roundRect((CARD_WIDTH - art_size_x) / 2, art_top, art_size_x, art_size_y, [info_corner_roundness, info_corner_roundness, 0, 0]);
	ctx_info.stroke();
	ctx_info.fill();
	ctx_info.closePath();
	ctx_info.restore();

	// Add card art
	ctx_info.globalCompositeOperation = 'destination-over';
	const card_art = await Canvas.loadImage(path.join(__dirname, '../cards/assets/kaiju_2023/banansa.png'));
	ctx_info.drawImage(card_art,
		(card_art.width - (art_size_x / art_scale)) / 2 - art_offset_x, (card_art.height - (art_size_y / art_scale)) / 2 - art_offset_y, art_size_x / art_scale, art_size_y / art_scale,
		(CARD_WIDTH - art_size_x) / 2, art_top, art_size_x, art_size_y);

	// Add namebox
	ctx_info.save();
	ctx_info.globalCompositeOperation = 'source-over';
	ctx_info.beginPath();
	ctx_info.strokeStyle = card_art_border_color;
	ctx_info.lineWidth = card_art_border_thickness;
	ctx_info.fillStyle = 'rgba(255, 255, 255, 0.15)';
	ctx_info.roundRect((CARD_WIDTH - art_size_x) / 2, art_top + art_size_y + vert_info_space, nameplate_width, info_height, [0, 0, 0, info_corner_roundness]);
	ctx_info.fillRect((CARD_WIDTH - art_size_x) / 2, art_top + art_size_y + vert_info_space, nameplate_width, info_height);
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.stroke();
	ctx_info.closePath();
	ctx_info.restore();

	// Format logo
	ctx_noshadow.globalCompositeOperation = 'source-over';
	ctx_noshadow.beginPath();
	ctx_noshadow.lineWidth = card_art_border_thickness;
	ctx_noshadow.roundRect((CARD_WIDTH - art_size_x) / 2 + nameplate_width + vert_info_space, art_top + art_size_y + vert_info_space, info_height, info_height, [0, 0, info_corner_roundness, 0]);
	ctx_noshadow.fill();
	ctx_noshadow.stroke();
	ctx_noshadow.closePath();
	ctx_noshadow.globalCompositeOperation = 'source-atop';
	ctx_noshadow.drawImage(sns_logo,
		0, 0, sns_logo.width, sns_logo.height,
		(CARD_WIDTH - art_size_x) / 2 + nameplate_width + vert_info_space - card_art_border_thickness / 2, art_top + art_size_y + vert_info_space - card_art_border_thickness / 2, info_height + card_art_border_thickness, info_height + card_art_border_thickness);

	// Put logo on otherbox
	ctx_info.globalCompositeOperation = 'source-over';
	ctx_info.save();
	ctx_info.beginPath();
	ctx_info.lineWidth = card_art_border_thickness;
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.roundRect((CARD_WIDTH - art_size_x) / 2 + nameplate_width + vert_info_space, art_top + art_size_y + vert_info_space, info_height, info_height, [0, 0, info_corner_roundness, 0]);
	ctx_info.fill();
	ctx_info.stroke();
	ctx_info.closePath();
	ctx_info.restore();
	ctx_info.drawImage(canvas_noshadow, 0, 0);

	// Add nametext
	ctx_info.beginPath();
	ctx_info.fillStyle = card_art_border_color;
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.font = text_format;
	ctx_info.fillText(card_name,
		(CARD_WIDTH - art_size_x) / 2 + nameplate_width / 2,
		art_top + art_size_y + vert_info_space + info_height / 2 + card_art_border_thickness / 2,
		max_text_width);
	ctx_info.closePath();

	// Layer collapse
	context.globalCompositeOperation = 'source-atop';
	// Overlay background gradient with hex
	context.drawImage(canvas_hex, 0, 0);
	// Apply info to card base
	context.drawImage(canvas_info, 0, 0);

	return await canvas.encode('png');
}

module.exports = {
	CARD_WIDTH: CARD_WIDTH,
	CARD_HEIGHT: CARD_HEIGHT,
	makeGradient: makeGradient,
	generateCard: generateCard,
};