const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');

const commandsGlobal = [];
const commandsLocal = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const globalBlacklist = ['banish.js', 'patch.js'];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	console.log(file);
	if (globalBlacklist.includes(`${file}`)) {
		commandsLocal.push(command.data.toJSON());
		console.log('!!!');
	} else {
		commandsGlobal.push(command.data.toJSON());
		console.log('?');
	}
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const clear = false;

if (!clear) {
	(async () => {
		try {
			console.log(`Started refreshing ${commandsLocal.length} LOCAL application (/) commands.`);
			const data = await rest.put(
				Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
				{ body: commandsLocal },
			);
			console.log(`Successfully reloaded ${data.length} LOCAL application (/) commands.`);
		} catch (error) {
			console.error('An error occurred wihle refreshing LOCAL commands:', error);
		}

		try {
			console.log(`Started refreshing ${commandsGlobal.length} GLOBAL application (/) commands.`);
			const data = await rest.put(
				Routes.applicationCommands(process.env.APP_ID),
				{ body: commandsGlobal },
			);
			console.log(`Successfully reloaded ${data.length} GLOBAL application (/) commands.`);
		} catch (error) {
			console.error('An error occurred wihle refreshing GLOBAL commands:', error);
		}
	})();
} else {
	(async () => {
		try {
			console.log(`Started deleting ${commandsLocal.length} application (/) commands LOCALLY.`);
			await rest.put(
				Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
				{ body: [] },
			);
			console.log('Successfully deleted application (/) commands LOCALLY');
		} catch (error) {
			console.error('An error occurred wihle deleting commands:', error);
		}

		try {
			console.log(`Started deleting ${commandsGlobal.length} application (/) commands GLOBALLY.`);
			await rest.put(
				Routes.applicationCommands(process.env.APP_ID),
				{ body: [] },
			);
			console.log('Successfully deleted application (/) commands GLOBALLY');
		} catch (error) {
			console.error('An error occurred wihle deleting commands:', error);
		}
	})();
}