const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// console.log(command);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error('An error occurred wihle refreshing commands:', error);
	}
})();
/*
(async () => {
	try {
		console.log(`Started deleting ${commands.length} application (/) commands GLOBALLY.`);
		const data = await rest.put(
			Routes.applicationCommands(process.env.APP_ID),
			{ body: [] },
		);
		console.log(`Successfully deleted ${data.length} application (/) commands GLOBALLY`);
	} catch (error) {
		console.error('An error occurred wihle deleting commands:', error);
	}
})();
*/