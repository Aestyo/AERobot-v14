const log = require('../../../utils/logger');
const attachment = require('../../../utils/attachment');

module.exports = {
	name: 'messageCreate',

	async execute(client, message) {
		if (message.author.bot) return;
		if (message.content.toUpperCase().includes('QUOI') ||
			message.content.toUpperCase().includes('KOI') ||
			message.content.toUpperCase().includes('KOA') ||
			message.content.toUpperCase().includes('KWA') ||
			message.content.toUpperCase().includes('KOUA') ||
			message.content.toUpperCase().includes('QUOUA')) {
			message.reply('Feur !');
		}
		if (!message.content.startsWith(process.env.PREFIX)) {
			const attachmentStr = message.attachments.size > 0 ? await attachment.download(message.attachments) : '';
			log.info(`[${message.guild.name}]#[${message.channel.name}] : ${message.author.tag} a écrit "${message.content}" ${attachmentStr}`);
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