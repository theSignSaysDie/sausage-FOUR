const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({
			status: 'online', // You can show online, idle....
			game: {
				name: 'with my girlboss wife Honey', // The message shown
				type: 'PLAYINGSTREAMING', // PLAYING: WATCHING: LISTENING: STREAMING:
			},
		});
	},
};
