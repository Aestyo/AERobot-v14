const { GetAudioPlayer, CreateAudioPlayer } = require('../../../utils/player');
const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
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
		if (player.shuffle) {
			player.shuffle = false;
			interaction.reply('shuffle mode off');
		} else {
			player.shuffle = true;
			interaction.reply('shuffle mode on');
		}
	},

	run: async function(client, message) {
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
		if (player.shuffle) {
			player.shuffle = false;
			message.reply('shuffle mode off');
		} else {
			player.shuffle = true;
			message.reply('shuffle mode on');
		}
	},

};