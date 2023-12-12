const { EmbedBuilder } = require('discord.js');
const { versionNum, lastUpdated } = require('../utils/info');

/**
 * @desc Capitalizes a string (ex. `"test" => "Test"`)
 * @param {String} str a string to be capitalized
 * @returns the capitalized string
 */
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @desc Capitalizes a phrase (ex. `"That sounds strAnge" => "That Sounds Strange"`)
 * @param {String} str a string to be converted to title case
 * @returns the string in title case
 */
function titleCase(str) {
	return str.toLowerCase().split(' ').map(function(word) {
		return word.replace(word[0], word[0].toUpperCase());
	}).join(' ');
}

/**
 * @desc converts a string to camelCase (ex. `"Test string" => "testString"`)
 * @param {String} str a string to be converted to camelCase
 * @returns the string in camelCase
 */
function camelize(str) {
	return titleCase(str)
		.replace(/[^ a-zA-Z]/g, '')
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

/**
 * @desc produces a default embed with footer, help info, and last update time.
 * @returns the default embed
 */
function getDefaultEmbed() {
	return new EmbedBuilder().setFooter({ text: `Sausage ${versionNum}   |   Last update -> ${lastUpdated.toLocaleString('en-US', { dateStyle: 'short' })}  |   Do /help for more commands` });
}

/**
 * @desc produces a help embed. Simple wrapper.
 * @param {String} information description for the embed
 * @returns the help embed
 */
// TODO consider removing this - 'fluff'
function getHelpEmbed(information) {
	return getDefaultEmbed()
		.setDescription(information);

}

/**
 * @desc produces a prefix/suffix encased value from a string, or the empty string if nothing exists.
 * @param {String} thing the thing to encase or discard
 * @param {String} prefix prefix
 * @param {String} suffix suffix
 * @returns a prefixed/suffixed string
 */
function blankNoneOrUndefined(thing, prefix = '', suffix = '') {
	return thing === undefined || thing === '' ? '' : `${prefix}${thing}${suffix}`;
}

/**
 * @desc Helper method. Quickly generates list options for commands
 * @param {Array<String>} stringArr array of strings
 * @returns a list of objects with names and values which are equivalent
 */
function dictList(stringArr) {
	return stringArr.map((item) => ({ name: item, value: item }));
}

/**
 * @desc Helper method. Converts full text body into excerpt
 * @param {String} body a full post to convert to an excerpt
 * @returns a string consisting of only the first 50 words of the first three paragraphs of the post
 */
function getExcerpt(body) {
	const firstThreeParagraphs = body.split('\n\n').slice(0, 3).join('\n\n');
	const firstFiftyWords = firstThreeParagraphs.split(' ').slice(0, 50).join(' ');
	return firstFiftyWords + (body.length > firstFiftyWords.length ? '...' : '');
}

/**
 * @desc Helper method. Cuts off text at threshold and adds ellipsis where required
 * @param {String} text a line of text to process
 * @param {int} maxLen the max length of the string
 * @returns `text`, truncated and with ellipsis appended if needed
 */
function cutoffWithEllipsis(text, maxLen) {
	if (text.length > maxLen) {
		text = text.slice(0, maxLen - 3) + '...';
	}
	return text;
}

module.exports = {
	capitalize: capitalize,
	camelize: camelize,
	getDefaultEmbed: getDefaultEmbed,
	getHelpEmbed: getHelpEmbed,
	blankNoneOrUndefined: blankNoneOrUndefined,
	getExcerpt: getExcerpt,
	cutoffWithEllipsis: cutoffWithEllipsis,
	titleCase: titleCase,
	dictList : dictList,
};