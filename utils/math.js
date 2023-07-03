function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function zip(a, b) {
	return a.map((e, i) => [e, b[i]]);
}

module.exports = {
	round: round,
	zip: zip,
};