// Require the necessary discord.js classes
const fs = require('fs');
const mysql = require('mysql2');
const { Client, Collection, Intents } = require('discord.js');
const { token, host, user, password, database } = require('./config.json');
const { Player }= require('discord-player');

// Create a new client instance
const client = new Client({ 
	intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILDS] 
});

// Create a new Player (you don't need any API Key)
const player = new Player(client);

player.on('error', (queue, error) => {
	console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on('connectionError', (queue, error) => {
	console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});
player.on('trackStart', (queue, track) => {
	queue.metadata.channel.send(`Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});
player.on('trackAdd', (queue, track) => {
	queue.metadata.channel.send(`Track **${track.title}** queued!`);
});
player.on('botDisconnect', queue => {
	queue.metadata.channel.send('I was manually disconnected from the voice channel, clearing queue!');
});
player.on('channelEmpty', queue => {
	queue.metadata.channel.send('Nobody is in the voice channel, leaving...');
});
player.on('queueEnd', queue => {
	queue.metadata.channel.send('Queue finished!');
});


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// connects to your database
const con = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Checks if you connected to your database
con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL connected!");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName.toLowerCase());

	if (!command) return;

	try {
		await command.execute(interaction, player, con);
	} catch (error) {
		console.error(error);
		await interaction.followUp({ 
			content: 'There was an error while executing this command!', 
			ephemeral: true 
		});
	}
});

// Login to Discord with your client's token
client.login(token);