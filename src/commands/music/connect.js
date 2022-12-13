const { GetAudioPlayer, CreateAudioPlayer, JoinChannel } = require('../../../utils/music');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		let audioPlayer = await GetAudioPlayer(client, interaction.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, interaction.guild, interaction.channel);
		}
		JoinChannel(client, interaction.channel, interaction.member, audioPlayer);
		interaction.reply(`<:Yes:1051950543997763748> Connecté vocalement à **${interaction.member.voice.channel.name}**`);
	},

	run: async function(client, message) {
		let audioPlayer = await GetAudioPlayer(client, message.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, message.guild, message.channel);
		}
		JoinChannel(client, message.channel, message.member, audioPlayer);
		message.channel.send(`<:Yes:1051950543997763748> Connecté vocalement à **${message.member.voice.channel.name}**`);
	},

};