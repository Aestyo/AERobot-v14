const { getVoiceConnection } = require('@discordjs/voice');
const { GetAudioPlayer } = require('../../../utils/player');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		const player = await GetAudioPlayer(client, interaction.guild);
		if (!player || getVoiceConnection(interaction.guild.id) == null) {
			interaction.reply('<:No:1051950542454276117> Je n\'ai aucun channel à déconnecter');
		} else {
			player.leave();
			interaction.reply('<:Yes:1051950543997763748> Déconnecté');
		}
	},

	run: async function(client, message) {
		const player = await GetAudioPlayer(client, message.guild);
		if (!player || getVoiceConnection(message.guild.id) == null) {
			message.reply('<:No:1051950542454276117> Je n\'ai aucun channel à déconnecter');
		} else {
			player.leave();
			message.reply('<:Yes:1051950543997763748> Déconnecté');
		}
	},

};