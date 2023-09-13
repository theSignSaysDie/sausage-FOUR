const Canvas = require('@napi-rs/canvas');
const path = require('node:path');
const { makeGradient } = require('../../../utils/cards');

const global_settings = {
	card_width: 900,
	card_height: 1200,
	card_border_offset: 20,
	card_border_thickness: 16,
	card_corner_roundness: 80,
	grd_start: 0.5,
	art_size_x: 700,
	art_size_y: 850,
	art_top: 100,
	card_art_border_thickness: 20,
	drop_shadow_blur: 15,
	vert_info_space: 50,
	info_height: 100,
	info_corner_roundness: 25,
	text_font_size: 64,
	text_modifiers: 'bold',
	text_font: 'Courier New',
};
async function paintCard(data, set, name) {
	const { card_info } = data;
	const { card_width, card_height, card_border_offset, card_border_thickness, card_corner_roundness, grd_start, art_size_x, art_size_y, art_top, card_art_border_thickness, drop_shadow_blur, vert_info_space, info_height, info_corner_roundness, text_font_size, text_modifiers, text_font } = global_settings;
	const { card_name, art_path, card_border_color, bg_grd_start, bg_grd_end, bg_hex_start, bg_hex_end, art_offset_x, art_offset_y, art_scale, text_color, card_art_border_color, drop_shadow_color } = card_info.cards[name];
	const text_format = `${text_modifiers} ${text_font_size}px ${text_font}`;
	const nameplate_width = art_size_x - vert_info_space - info_height;
	const max_text_width = nameplate_width - card_border_thickness * 4;

	const art_dir = path.join(__dirname, '../../', `${set}/art/`);

	// Hex svg mask
	const hexes = await Canvas.loadImage(path.join(__dirname, 'assets/hex_final.svg'));
	const logo = await Canvas.loadImage(path.join(art_dir, 'logo.png'));

	// Hex background layer
	const canvas_hex = Canvas.createCanvas(card_width, card_height);
	const ctx_hex = canvas_hex.getContext('2d');
	ctx_hex.imageSmoothingEnabled = true;

	// Infoboxes layer
	const canvas_info = Canvas.createCanvas(card_width, card_height);
	const ctx_info = canvas_info.getContext('2d');
	ctx_info.imageSmoothingEnabled = true;
	ctx_info.textAlign = 'center';

	// Logo layer
	const canvas_noshadow = Canvas.createCanvas(card_width, card_height);
	const ctx_noshadow = canvas_noshadow.getContext('2d');
	ctx_noshadow.imageSmoothingEnabled = true;

	// Final layer
	const canvas = Canvas.createCanvas(card_width, card_height);
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
	ctx_info.roundRect((card_width - art_size_x) / 2, art_top, art_size_x, art_size_y, [info_corner_roundness, info_corner_roundness, 0, 0]);
	ctx_info.stroke();
	ctx_info.fill();
	ctx_info.closePath();
	ctx_info.restore();

	// Add card art
	ctx_info.globalCompositeOperation = 'destination-over';
	const card_art = await Canvas.loadImage(path.join(art_dir, '/', art_path));
	ctx_info.drawImage(card_art,
		(card_art.width - (art_size_x / art_scale)) / 2 + art_offset_x, (card_art.height - (art_size_y / art_scale)) / 2 + art_offset_y, art_size_x / art_scale, art_size_y / art_scale,
		(card_width - art_size_x) / 2, art_top, art_size_x, art_size_y);

	// Add fuzzy background to card art
	ctx_info.save();
	ctx_info.globalCompositeOperation = 'destination-over';
	ctx_info.beginPath();
	ctx_info.fillStyle = 'rgba(255, 255, 255, 0.20)';
	ctx_info.fillRect((card_width - art_size_x) / 2, art_top, art_size_x, art_size_y);
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.fill();
	ctx_info.closePath();
	ctx_info.restore();


	// Add namebox
	ctx_info.save();
	ctx_info.globalCompositeOperation = 'source-over';
	ctx_info.beginPath();
	ctx_info.strokeStyle = card_art_border_color;
	ctx_info.lineWidth = card_art_border_thickness;
	ctx_info.fillStyle = 'rgba(255, 255, 255, 0.15)';
	ctx_info.roundRect((card_width - art_size_x) / 2, art_top + art_size_y + vert_info_space, nameplate_width, info_height, [0, 0, 0, info_corner_roundness]);
	ctx_info.fillRect((card_width - art_size_x) / 2, art_top + art_size_y + vert_info_space, nameplate_width, info_height);
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.stroke();
	ctx_info.closePath();
	ctx_info.restore();

	// Format logo
	ctx_noshadow.drawImage(logo,
		0, 0, logo.width, logo.height,
		(card_width - art_size_x) / 2 + nameplate_width + vert_info_space - card_art_border_thickness / 2, art_top + art_size_y + vert_info_space - card_art_border_thickness / 2, info_height + card_art_border_thickness, info_height + card_art_border_thickness);
	ctx_info.drawImage(canvas_noshadow, 0, 0);

	// Add nametext drop shadow
	ctx_info.globalCompositeOperation = 'source-over';
	ctx_info.save();
	ctx_info.beginPath();
	ctx_info.fillStyle = drop_shadow_color;
	ctx_info.shadowColor = drop_shadow_color;
	ctx_info.shadowBlur = drop_shadow_blur;
	ctx_info.font = text_format;
	ctx_info.fillText(card_name,
		(card_width - art_size_x) / 2 + nameplate_width / 2,
		art_top + art_size_y + vert_info_space + info_height - text_font_size / 2,
		max_text_width);
	ctx_info.closePath();
	ctx_info.restore();

	// Add nametext
	ctx_info.save();
	ctx_info.beginPath();
	ctx_info.fillStyle = text_color;
	ctx_info.font = text_format;
	ctx_info.fillText(card_name,
		(card_width - art_size_x) / 2 + nameplate_width / 2,
		art_top + art_size_y + vert_info_space + info_height - text_font_size / 2,
		max_text_width);
	ctx_info.closePath();
	ctx_info.restore();

	// Layer collapse
	context.globalCompositeOperation = 'source-atop';
	// Overlay background gradient with hex
	context.drawImage(canvas_hex, 0, 0);
	// Apply info to card base
	context.drawImage(canvas_info, 0, 0);

	return await canvas.encode('png');
}

module.exports = {
	paintCard: paintCard,
};