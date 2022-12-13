const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		const connection = getVoiceConnection(interaction.guild.id);
		if (connection) {
			connection.destroy();
			interaction.reply('<:Yes:1051950543997763748> Déconnecté');
		} else {
			interaction.reply('<:No:1051950542454276117> Je n\'ai aucun channel à déconnecter');
		}
	},

	run: async function(client, message) {
		const connection = getVoiceConnection(message.guild.id);
		if (connection) {
			connection.destroy();
			message.channel.send('<:Yes:1051950543997763748> Déconnecté');
		} else {
			message.channel.send('<:No:1051950542454276117> Je n\'ai aucun channel à déconnecter');
		}
	},

};