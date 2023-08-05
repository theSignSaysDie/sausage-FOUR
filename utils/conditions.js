function isAllowed(conditions) {
	for (const [key, value] of Object.entries(conditions)) {
		switch (key) {
		case 'DEBUG_OVERRIDE':
			return !!value;
		case 'MONTH':
			if (new Date().getMonth() !== value) return false;
			break;
		default:
			break;
		}
	}
	return true;
}

module.exports = {
	isAllowed: isAllowed,
};