/**
 * @desc provides simple number rounding functionality
 * @param {Number} value number to round
 * @param {Integer} decimals number of decimal places to round to
 * @returns a rounded number
 */
function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

/**
 * @desc zips two arrays of equal length `N` into `N` pairs
 * @param {Array} a the first array
 * @param {Array} b the second array
 * @returns an array of two-element arrays
 */
function zip(a, b) {
	return a.map((e, i) => [e, b[i]]);
}

/**
 * @desc helper method for command setup. Converts a list [a, b, ..., y, z] into [{name: "a", value: "a"}, ...]
 * @param {Array<String>} values A list of string values to convert into command options
 * @returns a list of objects representing command options to be unpacked
 */
function easyListItems(values) {
	return values.map((v) => ({ name: v, value: v }));
}

module.exports = {
	round: round,
	zip: zip,
	easyListItems: easyListItems,
};