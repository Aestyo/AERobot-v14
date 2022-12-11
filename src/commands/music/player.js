const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const log = require('../../../utils/logger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('show')
				.setDescription('Affiche le lecteur'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Ajoute une musique au lecteur')
				.addStringOption(option => option
					.setName('url')
					.setDescription('URL YouTube de la musique')
					.setRequired(true))),

	execute: async function(client, interaction) {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'show':{

				break;
			}
			case 'add':{

				break;
			}
		}
		interaction.editReply('Fini');
	},

	run: async function(client, message, args) {
		log.info(client, message, args);
	},

};