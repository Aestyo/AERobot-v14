/**
 *  _______  _______  _______  _______  ______   _______ _________
 * |  ___  ||  ____ \|  ____ ||  ___  ||  ___ \ |  ___  |\__   __/
 * | |   | || |    \/| |    ||| |   | || |   | || |   | |   | |
 * | |___| || |__    | |____||| |   | || |__/ / | |   | |   | |
 * |  ___  ||  __|   |     __|| |   | ||  __ |  | |   | |   | |
 * | |   | || |      | |\ |   | |   | || |  \ \ | |   | |   | |
 * | |   | || |____/\| | \ \__| |___| || |___\ || |___| |   | |
 * |/     \||_______/|/   \__/|_______||______/ |_______|   |_|
 */
// Déclaration des modules principaux : discordjs, music-player mongodb
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// const { Player } = require('discord-music-player');

// Déclaration des modules utilitaires : logger, .env
const log = require('./utils/logger.js');
const dotenv = require('dotenv');

// Configuration des variables d'environnement et initialisation du logger
dotenv.config();
log.init();

// Création de l'instance du client avec ses intentions
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
] });

// Génération d'une collection de toutes les commandes et chargement des évènements
// à l'aides des ./handlers/*.js
log.info('Chargement des commandes et des évènements');
['commands'].forEach((x) => (client[x] = new Collection()));
['commands', 'events'].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

// Création de l'objet lecteur de musique
client.MusicPlayers = [];

// Connexion du client à l'API de Discord
client.login(process.env.TOKEN_DISCORD);