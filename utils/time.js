const { create } = require('discord-timestamps');

async function makeRelativeTimestamp(offset) {
	return await create(offset / 1000, 'relative');
}
module.exports = {
	makeRelativeTimestamp: makeRelativeTimestamp,
};