const { GetAudioPlayer, JoinChannel, FindSong, DownloadSong, PlaySong } = require('../../../utils/music');
const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const log = require('../../../utils/logger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option => option
			.setName('query')
			.setDescription('Mots-clés de la recherche YouTube')
			.setRequired(true)),

	execute: async function(client, interaction) {
		await interaction.deferReply();
		const audioPlayer = await GetAudioPlayer(client, interaction);
		if (getVoiceConnection(interaction.guild.id) == null) {
			if (JoinChannel(interaction, audioPlayer) == 1) return;
			interaction.channel.send(`<:Yes:1051950543997763748> Connecté vocalement à **${interaction.member.voice.channel.name}**`);
		}
		const userQuery = interaction.options.getString('query');
		const song = await FindSong(interaction, userQuery);
		const song_path = await DownloadSong(interaction, song);
		PlaySong(interaction, audioPlayer, song_path);

	},

	run: async function(client, message, args) {
		log.info(client, message, args);
	},

};