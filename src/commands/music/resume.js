const { GetAudioPlayer, CreateAudioPlayer } = require('../../../utils/music');
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		let audioPlayer = await GetAudioPlayer(client, interaction.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, interaction.guild, interaction.channel);
		}
		audioPlayer.unpause(true);
		interaction.reply({ embeds: [Embedded(interaction.user, interaction.guild)] });
	},

	run: async function(client, message) {
		let audioPlayer = await GetAudioPlayer(client, message.guild);
		if (!audioPlayer) {
			audioPlayer = await CreateAudioPlayer(client, message.guild, message.channel);
		}
		audioPlayer.unpause(true);
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
		.setThumbnail('https://imgur.com/cxC9flw.png')
		.setImage('https://imgur.com/ayiVJSS.gif');
	return embed;
}