const { Client, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

// Création de l'instance du client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN_DISCORD);