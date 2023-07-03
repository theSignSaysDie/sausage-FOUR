// Const Canvas = require('@napi-rs/canvas');
const { zip } = require('./math');

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

module.exports = {
	CARD_WIDTH: CARD_WIDTH,
	CARD_HEIGHT: CARD_HEIGHT,
	makeGradient: makeGradient,
};