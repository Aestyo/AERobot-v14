const { GetAudioPlayer, CreateAudioPlayer } = require('../../../utils/player');
const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
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
		player.resume();
		interaction.reply({ embeds: [Embedded(interaction.user, interaction.guild)] });
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
		player.resume();
		message.channel.send({ embeds: [Embedded(message.author, message.guild)] });
	},

};

function Embedded(user, guild) {
	const embed = new EmbedBuilder()
		.setAuthor({
			name: `${user.tag}`,
			iconURL: user.avatarURL(),
			url: `https://discordapp.com/users/${user.id}`,
		})
		.setURL('https://www.youtube.com')
		.setColor('#4C59EB')
		.setFooter({ text: 'Powered by Æstyo Corp.' })
		.setTimestamp()
		.setTitle(`Lecteur musical de __**${guild.name}**__`)
		.setDescription('La lecture a été reprise')
		.setThumbnail('https://imgur.com/cxC9flw.png');
	return embed;
}