const { GetAudioPlayer, ShowPlayer } = require('../../../utils/music');
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
				.setDescription('Affiche le lecteur')),

	execute: async function(client, interaction) {

		await interaction.deferReply();
		const audioPlayer = await GetAudioPlayer(client, interaction);

		switch (interaction.options.getSubcommand()) {
			case 'show':{
				ShowPlayer(interaction, audioPlayer);
				break;
			}
		}
		interaction.editReply('<:Yes:1051950543997763748> Validé');
	},

	run: async function(client, message, args) {
		log.info(client, message, args);
	},

};