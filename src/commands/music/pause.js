const { GetAudioPlayer, CreateAudioPlayer } = require('../../../utils/music');
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		let audioPlayer = await GetAudioPlayer(client, interaction.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, interaction.guild, interaction.channel);
		}
		audioPlayer.pause(true);
		interaction.reply({ embeds: [Embedded(interaction.user, interaction.guild)] });
	},

	run: async function(client, message) {
		let audioPlayer = await GetAudioPlayer(client, message.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, message.guild, message.channel);
		}
		audioPlayer.pause(true);
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
		.setDescription('La lecture a été mise en pause')
		.setThumbnail('https://imgur.com/Yum9q6Q.png')
		.setImage('https://imgur.com/13nB881.png');
	return embed;
}