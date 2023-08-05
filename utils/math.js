function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function zip(a, b) {
	return a.map((e, i) => [e, b[i]]);
}

function objectMap(object, mapFn) {
	return Object.keys(object).reduce(function(result, key) {
		result[key] = mapFn(object[key]);
		return result;
	}, {});
}

function objectToListMap(object, mapFn) {
	return Object.keys(object).reduce(function(result, key) {
		result.push(mapFn(object[key]));
		return result;
	}, []);
}

module.exports = {
	round: round,
	zip: zip,
	objectMap: objectMap,
	objectToListMap: objectToListMap,
};