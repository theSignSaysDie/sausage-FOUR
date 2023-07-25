require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { schedule } = require('node-cron');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./utils/db');

// Initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions] });

// Load commands
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Load event listeners
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Load troll call and other resources
schedule('0 0 * * * *', function() {
	console.log('---------------------');
	db.trollFirstNameDict, db.trollFullNameDict, db.trollTitleDict = db.loadTrollCall();
});


// Login!
client.login(process.env.DISCORD_TOKEN);