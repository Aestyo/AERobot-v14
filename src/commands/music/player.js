const { GetAudioPlayer, JoinChannel, FindSong, DownloadSong, ShowPlayer, PlaySong } = require('../../../utils/music');
const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
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
				.setName('join')
				.setDescription('Rejoins le channel vocal'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('disconnect')
				.setDescription('Déconnecte le lecteur'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Ajoute une musique au lecteur')
				.addStringOption(option => option
					.setName('query')
					.setDescription('Mots-clés de la recherche YouTube')
					.setRequired(true))),

	execute: async function(client, interaction) {

		await interaction.deferReply();
		const audioPlayer = await GetAudioPlayer(client, interaction);

		switch (interaction.options.getSubcommand()) {
			case 'show':{
				ShowPlayer(interaction, audioPlayer);
				break;
			}
			case 'join':{
				JoinChannel(interaction);
				break;
			}
			case 'add':{
				if (getVoiceConnection(interaction.guild.id) == null) {
					if (JoinChannel(interaction) == 1) return;
				}
				const userQuery = interaction.options.getString('query');
				const song = await FindSong(interaction, userQuery);
				const song_path = await DownloadSong(interaction, song);
				PlaySong(interaction, audioPlayer, song_path);
				break;
			}
			case 'disconnect':{
				const connection = getVoiceConnection(interaction.guild.id);
				if (connection) {
					connection.destroy();
					interaction.editReply('<:Yes:1051950543997763748> Déconnecté');
				} else {
					interaction.editReply('<:No:1051950542454276117> Je n\'ai aucun channel à déconnecter');
				}
				break;
			}
		}
	},

	run: async function(client, message, args) {
		log.info(client, message, args);
	},

};