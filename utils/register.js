const log = require('./logger');
const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);
const clientId = process.env.ID_CLIENT;
const guildId = process.env.ID_DEVGUILD;

async function Guild(commands) {
	(async () => {
		try {
			log.info('Rechargement des commandes locales...');

			const commands_json = [];
			commands.forEach(cmd => {
				commands_json.push(cmd.data.toJSON());
			});

			await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands_json });

			log.success('Commandes enregistrées avec succès localement');
		} catch (error) {
			log.error(error);
		}
	})();
}

function Global(commands) {
	(async () => {
		try {
			log.info('Rechargement des commandes globales...');

			const commands_json = [];
			commands.forEach(cmd => {
				commands_json.push(cmd.data.toJSON());
			});
			await rest.put(Routes.applicationCommands(clientId), { body: commands_json });

			log.success('Commandes enregistrées avec succès globalement');
		} catch (error) {
			log.error(error);
		}
	})();
}

module.exports = { Guild, Global };