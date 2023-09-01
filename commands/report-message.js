const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { getExcerpt } = require('../utils/stringy');
module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('anon-quote')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		console.log(interaction.targetMessage);
		const anonChannel = await interaction.client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.ANON_CHANNEL);
		await anonChannel.send({ content:`An anonymous user reported a message from Serverstuck user ${interaction.targetMessage.author}:`, allowedMentions : { parse: [] } });
		await anonChannel.send({ content:`>>> ${getExcerpt(interaction.targetMessage.content)}` });
		await anonChannel.send({ content:`To see the message in context, click here: ${interaction.targetMessage.url}` });
		await interaction.reply({ content: 'This message has been reported in the anon-note channel!', ephemeral:true });
	},
};