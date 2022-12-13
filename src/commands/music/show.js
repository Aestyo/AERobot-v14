const { GetAudioPlayer, CreateAudioPlayer, ShowPlayer } = require('../../../utils/music');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		let audioPlayer = await GetAudioPlayer(client, interaction.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, interaction.guild, interaction.channel);
		}
		interaction.reply({ embeds: [ShowPlayer(interaction.user, interaction.guild)] });
	},

	run: async function(client, message) {
		let audioPlayer = await GetAudioPlayer(client, message.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, message.guild, message.channel);
		}
		message.channel.send({ embeds: [ShowPlayer(message.author, message.guild, audioPlayer)] });
	},

};