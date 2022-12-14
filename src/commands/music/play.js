const { GetSong } = require('../../../utils/music');
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
		const userQuery = interaction.options.getString('query');
		let player = await GetAudioPlayer(client, interaction.guild);
		if (!player) {
			const answer = await interaction.channel.send(`<a:loading:1051599264498851852> Création du lecteur pour **${interaction.guild.name}**`);
			player = await CreateAudioPlayer(client, interaction.guild, interaction.channel);
			answer.edit(`<:Yes:1051950543997763748> Lecteur connecté à **${interaction.guild.name}#${interaction.channel.name}**`);
		}
		if (getVoiceConnection(interaction.guild.id) == null) {
			if (player.join(client, interaction.member) == 1) return;
			interaction.channel.send(`<:Yes:1051950543997763748> Connecté vocalement à **${interaction.member.voice.channel.name}**`);
		}
		const song = await GetSong(interaction.channel, interaction.user, userQuery);
		if (song) player.play(song);
		console.log(song);
		interaction.editReply(`**${song.metadata.title}** a été ajouté à la liste de lecture`);
	},

	run: async function(client, message, args) {
		const response = await message.reply('<a:loading:1051599264498851852> *Ærobot réfléchis...*');
		if (args.length == 0) {
			return message.reply('L\'argument [query] est obligatoire.');
		}
		const userQuery = args.join(' ');
		let player = await GetAudioPlayer(client, message.guild);
		if (!player) {
			const answer = await message.channel.send(`<a:loading:1051599264498851852> Création du lecteur pour **${message.guild.name}**`);
			player = await CreateAudioPlayer(client, message.guild, message.channel);
			answer.edit(`<:Yes:1051950543997763748> Lecteur connecté à **${message.guild.name}#${message.channel.name}**`);
		}
		if (getVoiceConnection(message.guild.id) == null) {
			if (player.join(client, message.member) == 1) return;
			message.channel.send(`<:Yes:1051950543997763748> Connecté vocalement à **${message.member.voice.channel.name}**`);
		}
		const song = await GetSong(message.channel, message.author, userQuery);
		if (song) player.play(song);
		response.edit(`**${song.metadata.title}** a été ajouté à la liste de lecture`);
	},

};