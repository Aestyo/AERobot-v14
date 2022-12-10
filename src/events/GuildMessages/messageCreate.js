const log = require('../../../utils/logger');

module.exports = {
	name: 'messageCreate',

	async execute(client, message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(process.env.PREFIX)) {
			log.info(`[${message.guild.name}]#[${message.channel.name}] : ${message.author.tag} a écrit "${message.content}"`);
		} else {
			run(client, message);
		}
	},
};

async function run(client, message) {
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();
	if (commandName.length == 0) return;

	const command = client.commands.get(commandName);
	if (!command) {
		log.warn(`"${process.env.PREFIX}${commandName}" n'existe pas"`);
		message.reply(`:no_entry:  "${process.env.PREFIX}${commandName}" n'existe pas`);
		return;
	}
	if (command.ownerOnly && process.env.ID_OWNER != message.author.id) {
		message.reply({ content: ':no_entry:  Cette commande est réservée aux développeurs.', ephemeral: true });
		return;
	}
	log.info(`[${message.guild.name}]#[${message.channel.name}] : ${message.author.tag} a utilisé ${process.env.PREFIX}${commandName}`);
	try {
		command.run(client, message, args);
	} catch (error) {
		log.error(`Erreur lors de l'éxecution de ${commandName}`);
		log.error(error);
	}
}