const { Events } = require('discord.js');
const { activityMessage } = require('../utils/info');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity(activityMessage, { type: 0 });
	},
};
