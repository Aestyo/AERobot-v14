const log = require('../../../utils/logger');
const { ActivityType } = require('discord.js');
const register = require('../../../utils/register');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		log.success(`Connecté en tant que ${client.user.username}#${client.user.discriminator}`);

		// Modification du status
		const guilds = await client.guilds.fetch();
		let members = 0;
		client.guilds.cache.forEach((guild) => {
			members += guild.memberCount - 1;
		});
		log.info(`Présent sur ${guilds.size} serveurs`);
		log.info(`Observe ${members} membres`);

		const str = `${members} utilisateurs...`;

		client.user.setStatus('online');
		client.user.setActivity(str, { type: ActivityType.Watching });

		// Enregistrement des commandes slash
		await register.Guild(client.commands.map((cmd) => cmd));
		await register.Global(client.commands.map((cmd) => cmd));
	},
};