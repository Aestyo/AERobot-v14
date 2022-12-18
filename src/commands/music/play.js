const { JoinChannel, FindSong, DownloadSong, PlaySong } = require('../../../utils/music');
const { GetAudioPlayer, CreateAudioPlayer } = require('../../../utils/player');
const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
		interaction.deferReply();
		let audioPlayer = await GetAudioPlayer(client, interaction.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, interaction.guild, interaction.channel);
		}
		if (getVoiceConnection(interaction.guild.id) == null) {
			if (JoinChannel(client, interaction.channel, interaction.member, audioPlayer) == 1) return;
			interaction.channel.send(`<:Yes:1051950543997763748> Connecté vocalement à **${interaction.member.voice.channel.name}**`);
		}
		const userQuery = interaction.options.getString('query');
		const song = await FindSong(interaction.channel, interaction.user, userQuery);
		const song_path = await DownloadSong(interaction.channel, song);
		PlaySong(audioPlayer, song_path);
		interaction.editReply(`**${song.title}** a été ajouté à la liste de lecture`);
	},

	run: async function(client, message, args) {
		if (args.length == 0) {
			return message.channel.send('Aucune musique trouvée');
		}
		let audioPlayer = await GetAudioPlayer(client, message.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, message.guild, message.channel);
		}
		if (getVoiceConnection(message.guild.id) == null) {
			if (audioPlayer.join(client, message.member) == 1) return;
			message.channel.send(`<:Yes:1051950543997763748> Connecté vocalement à **${message.member.voice.channel.name}**`);
		}
		const userQuery = args.join(' ');
		const song = await FindSong(message.channel, message.author, userQuery);
		const song_path = await DownloadSong(message.channel, song);
		PlaySong(audioPlayer, song_path);
		message.channel.send(`**${song.title}** a été ajouté à la liste de lecture`);
	},

};