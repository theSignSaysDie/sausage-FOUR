const numerics = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function clamp(x, a, b) {
	return Math.max(Math.min(x, b), a);
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

function parseInt64(num, radix = 10) {
	if (radix % 1 !== 0 || (radix < 2 || radix > 64)) {
		throw new Error(`Radix out of range [2, 64]! (Received ${radix})`);
	} else {
		const allowedRange = numerics.slice(0, radix);
		const regex = `[${allowedRange}]+$`;
		if (!num.match(regex)) {
			throw new Error(`Number provided is not valid in base ${radix}! (${num})`);
		} else {
			return [...num].reduce((r, a) => r * radix + numerics.slice(0, radix).indexOf(a), 0);
		}
	}
}

function logBase(n, b) {
	return Math.log(b) / Math.log(n);
}

function toString64(num, radix = 10) {
	if (radix % 1 !== 0 || (radix < 2 || radix > 64)) {
		throw new Error(`Radix out of range [2, 64]! (Received ${radix})`);
	} else {
		let result = '';
		let currentPlace = Math.floor(logBase(radix, num));
		let quotient;
		while (currentPlace >= 0) {
			quotient = Math.floor(num / (radix ** currentPlace));
			result += numerics[quotient];
			num -= quotient * (radix ** currentPlace);
			currentPlace--;
		}
		return result;
	}
}

function getCurrentTimestamp() {
	return new Date().getTime();
}

module.exports = {
	round: round,
	zip: zip,
	objectMap: objectMap,
	objectToListMap: objectToListMap,
	parseInt64: parseInt64,
	toString64: toString64,
	getCurrentTimestamp: getCurrentTimestamp,
	clamp: clamp,
};