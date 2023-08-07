const { create } = require('discord-timestamps');

/**
 * @desc wrapper for `discord-timestamps.create`
 * @param {Integer} offset the time in seconds from now to make a timestamp for (ex. `in 4 hours`)
 * @returns a timestamp
 */
// TODO investigate possibly removing this? Maybe this whole file can go
async function makeRelativeTimestamp(offset) {
	return await create(offset / 1000, 'relative');
}
module.exports = {
	makeRelativeTimestamp: makeRelativeTimestamp,
};