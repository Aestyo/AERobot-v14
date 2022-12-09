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
// Déclaration des modules principaux : discordjs, mongodb
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

// Déclaration des modules utilitaires : logger, .env, fs
const log = require('./utils/logger.js');
const fs = require('node:fs');
const dotenv = require('dotenv');

// Configuration des variables d'environnement et initialisation du logger
dotenv.config();
log.init();

// Création de l'instance du client
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
] });

log.info('Chargement des commandes et des évènements');
['commands'].forEach((x) => (client[x] = new Collection()));
['commands'].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});


client.login(process.env.TOKEN_DISCORD);