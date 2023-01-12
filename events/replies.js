const { Events } = require('discord.js');
const { rollDice } = require('../utils/dice');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		if (interaction.author.bot) return;
		const text = interaction.content.toLowerCase().replace(/[^a-zA-Z ]/g, '');
		let messageContent;
		if (text.startsWith('theres been a second plane')) {
			messageContent = 'they hit the fucking pentagon.';
		} else if (text.startsWith('they hit the fucking pentagon')) {
			messageContent = 'there\'s been a second plane.';
		} else if (text.startsWith('i love you sausage')) {
			messageContent =
			rollDice(100)[0] == 69 ? 'fuck you bitch' : 'i love you too!';
		} else if (text.startsWith('im pitch for you')) {
			messageContent = ':slight_smile: <:shootem:568194854212075529>';
		} else if (text.startsWith('good evening sausage')) {
			messageContent = 'Good evening, friend!';
		} else if (text.startsWith('how are you sausage')) {
			messageContent = 'I\'m good! Hope you\'re doing well, friend!';
		} else if (text.startsWith('booba')) {
			messageContent = 'booba!';
		} else if (text.startsWith('goodnight sausage')) {
			messageContent = 'goodnight friend!';
		} else if (text == 'sausage') {
			messageContent = 'Ribbit.';
		} else if (
			text.startsWith('gm') &&
			interaction.author.id === '655478445794525185'
		) {
			messageContent = 'Morning! :]';
		} else if (text.startsWith('hi sausage')) {
			messageContent = 'Hello!';
		} else if (text.startsWith('good morning sausage')) {
			if (interaction.author.id === '230490310361219083') {
				messageContent = 'good morning envy 💚';
			} else if (interaction.author.id === '241999168875397120') {
				messageContent = 'good morning vriska 🤍';
			} else if (interaction.author.id === '315220045141770241') {
				messageContent = 'good morning meme ✅';
			} else if (interaction.author.id === '308760900016537610') {
				messageContent = 'good morning neo 💙';
			} else {
				messageContent = 'Good morning friend!';
			}
		} else if (
			text.startsWith('sausage my beloved') &&
			interaction.author.id === '655478445794525185'
		) {
			messageContent = 'honey my beloved';
		} else if (text.startsWith('pets sausage')) {
			// TODO fix
			messageContent = '<:frogchamp:1059214681836884018>';
		} else if (text.startsWith('i hate you clamkiller')) {
			// TODO fix
			messageContent = 'that\'s my friend :frowning2:';
		} else if (text.startsWith('i hate clamkiller')) {
			// TODO fix
			messageContent = 'that\'s my friend :frowning2:';
		}
		if (messageContent) {
			console.log('Message sent:', messageContent);
			await interaction.reply({ content: messageContent, allowedMentions: { repliedUser: false } });
		}
	},
};