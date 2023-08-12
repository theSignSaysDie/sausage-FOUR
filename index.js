require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { schedule } = require('node-cron');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./utils/db');
const { isAllowed } = require('./utils/conditions');

// Initialize client
console.log('Initializing client...');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions] });

// Load conditions for commands, events
const eventConditions = JSON.parse(fs.readFileSync(path.join(__dirname, 'events/eventConditions.json'), 'utf8'));
const commandConditions = JSON.parse(fs.readFileSync(path.join(__dirname, 'commands/commandConditions.json'), 'utf8'));

// Load commands
console.log('Loading commands...');
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('Sending commands...');
for (const file of commandFiles) {
	const commandName = file.slice(0, -3);
	if (commandConditions[commandName] && !isAllowed(commandConditions[commandName])) {
		console.log(`Skipped ${commandName}`);
		continue;
	}
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Load event listeners
console.log('Loading events...');
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log('Sending events...');
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const eventName = file.slice(0, -3);
	const event = require(filePath);
	if (eventConditions[eventName] && !isAllowed(eventConditions[eventName])) {
		console.log(`Skipped ${eventName}`);
		continue;
	}
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
		console.log(`Pushed ONCE ${eventName}`);
	} else {
		client.on(event.name, (...args) => event.execute(...args));
		console.log(`Pushed ON ${eventName}`);
	}
}

console.log('Initializing Troll Call...');
const now = new Date();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

db.trollFirstNameDict, db.trollFullNameDict, db.trollTitleDict = db.loadTrollCall();

// Load troll call and other resources
schedule(`${seconds} ${minutes} * * * *`, function() {
	console.log('---------------------');
	db.trollFirstNameDict, db.trollFullNameDict, db.trollTitleDict = db.loadTrollCall();
});


// Login!
console.log('Logging in...');
client.login(process.env.DISCORD_TOKEN);