const log = require('./logger');
const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);
const clientId = process.env.ID_CLIENT;
const guildId = process.env.ID_DEVGUILD;

async function Guild(commands) {
	(async () => {
		// try {
		log.info('Rechargement des commandes locales...');

		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

		log.success('Les commandes d\'application ont été enregistrées avec succès localement');
		// } catch (error) {
		// 	log.error(error);
		// }
	})();
}

function Global(commands) {
	(async () => {
		try {
			log.info('Rechargement des commandes globales...');

			await rest.put(Routes.applicationCommands(clientId), { body: commands });

			log.success('Les commandes de l\'application ont été enregistrées avec succès globalement');
		} catch (error) {
			log.error(error);
		}
	})();
}

module.exports = { Guild, Global };