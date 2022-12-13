const { GetAudioPlayer, JoinChannel } = require('../../../utils/music');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const log = require('../../../utils/logger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		const audioPlayer = await GetAudioPlayer(client, interaction);
		JoinChannel(interaction, audioPlayer);
		interaction.reply(`<:Yes:1051950543997763748> Connecté vocalement à **${interaction.member.voice.channel.name}**`);
	},

	run: async function(client, message, args) {
		log.info(client, message, args);
	},

};