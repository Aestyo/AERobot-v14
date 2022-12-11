const log = require('../../../utils/logger');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {

		switch (interaction.commandType) {
			case 1:{
				Exec(client, interaction);
				break;
			}
			default:{
				log.error('Type de commande non géré : ' + interaction.commandType);
				return;
			}
		}
	},
};

async function Exec(client, interaction) {
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		log.warn(`"${interaction.commandName}" n'existe pas"`);
		return;
	}
	if (command.ownerOnly && process.env.ID_OWNER != interaction.user.id) {
		interaction.reply({ content: ':no_entry:  Cette commande est réservée aux développeurs.', ephemeral: true });
		return;
	}
	log.info(`[${interaction.guild.name}]#[${interaction.channel.name}] : ${interaction.user.tag} a utilisé /${interaction.commandName}`);
	try {
		command.execute(client, interaction);
	} catch (error) {
		log.error(`Erreur lors de l'éxecution de ${interaction.commandName}`);
		log.error(error);
	}
}