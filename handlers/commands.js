const log = require('../utils/logger');
const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);

module.exports = async (client) => {
	(await pGlob(`${process.cwd()}/src/commands/*/*.js`)).map(async (cmdFile) => {
		const cmd = require(cmdFile);

		/* if (!cmd.data.name) {
			return log.warn(`Commande incorrecte, nom manquant - ${cmdFile}`);
		}
		 if (!cmd.data.default_member_permissions) {
			return log.warn(`Commande incorrecte, permission(s) manquante(s) - ${cmdFile}`);
		}*/

		client.commands.set(cmd.data.name, cmd);
	});
	log.success(`${client.commands.size} commandes chargées avec succès.`);
};