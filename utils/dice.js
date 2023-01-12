function rollDice(diceType, amt = 1, talent = 0) {
	const result = [];
	for (let i = 0; i < amt + Math.abs(talent); i++) {
		const roll = Math.floor(Math.random() * diceType) + 1;
		result.push(roll);
	}
	return result;
}

function markForSum(arr, num, talent) {
	let result;
	(result = []).length = arr.length;
	result.fill(0);
	const keys = Array.from({ length: arr.length }, (v, k) => k);
	keys.sort((a, b) => (talent < 0 ? arr[a] - arr[b] : arr[b] - arr[a]));
	for (let i = 0; i < num; i++) {
		result[keys[i]] = 1;
	}
	return result;
}

function modStr(num, spacey = false) {
	return num ? `${spacey ? ' ' : ''}${num != 0 ? (num > 0 ? '+' : '-') : ''}${spacey ? ' ' : ''}${Math.abs(num)}` : '';
}

function formatRoll(diceType, talent, modifier) {
	const baseDice = { 2: 8, 4: 4, 10: 1, 8: 2 };
	const addlDice = { 8: talent, 4: 2 * talent, 10: talent, 2: 0 };
	const numArr = rollDice(diceType, baseDice[diceType], addlDice[diceType]);
	const indices = markForSum(numArr, baseDice[diceType], talent);
	let totalSum = 0;
	for (let i = 0; i < numArr.length; i++) {
		totalSum += numArr[i] * indices[i];
	}
	const stringNums = [];
	for (let i = 0; i < numArr.length; i++) {
		let item = `${numArr[i]}`;
		if (numArr[i] == 1 || numArr[i] == diceType) {
			item = `**${item}**`;
		}
		if (indices[i] == 0) {
			item = `~~${item}~~`;
		}
		stringNums.push(item);
	}

	const extraDie = diceType == 10 ? rollDice(6, 1, 0)[0] : 0;
	return `(${stringNums.join(', ')}${
		diceType == 10 ? modStr(extraDie, true) : ''
	})${diceType == 2 ? '' : modStr(modifier, true)} = ${
		totalSum + extraDie + modifier * (diceType != 2)
	}`;
}


module.exports = {
	rollDice: rollDice,
	modStr: modStr,
	formatRoll: formatRoll,
};