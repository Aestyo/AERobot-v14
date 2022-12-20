const { createAudioPlayer, NoSubscriberBehavior, getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { humanUnitSize } = require('../utils/unitSize');

class MusicPlayer {
	constructor(guild, channel) {
		this.audio = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
		this.guild = guild;
		this.channel = channel;
		this.voiceChannel = null;
		this.queue = [];
		this.loop = false;
		this.shuffle = false;

		this.audio.addListener('stateChange', (oldOne, newOne) => {
			if (oldOne.status == 'playing' && newOne.status == 'idle') {
				this.queue.shift();
				if (this.queue.length > 0) this.audio.play(this.queue[0]);
			}
			if ((oldOne.status == 'idle' && newOne.status == 'buffering') || (oldOne.status == 'idle' && newOne.status == 'playing')) {
				const metadata = this.queue[0].metadata;
				const playingEmbed = new EmbedBuilder()
					.setColor(0x4C59EB)
					.setTitle(metadata.title)
					.setURL(metadata.url)
					.setAuthor({ name: 'En cours de lecture :' })
					.setDescription(`De ${metadata.author.name} - ${humanUnitSize(metadata.views)} vues - ${metadata.ago}`)
					.setImage(metadata.image)
					.setThumbnail('https://imgur.com/ayiVJSS.gif')
					.setTimestamp()
					.setFooter({ text: 'Powered by Æstyo Corp.' });
				if (!metadata.ago) playingEmbed.setDescription(`De ${metadata.author.name} - ${humanUnitSize(metadata.views)} vues`);
				this.channel.send({ embeds: [playingEmbed] });
			}
		});
	}

	play(ressource) {
		this.queue.push(ressource);
		if (this.audio.state.status == 'idle') {
			this.audio.play(this.queue[0]);
		}
	}

	pause() {
		this.audio.pause(true);
	}

	resume() {
		this.audio.unpause();
	}

	join(client, member) {
		const voiceChannel = member.voice.channel;
		if (!voiceChannel) {
			this.channel.send(':no_entry:  Impossible de rejoindre le salon vocal');
			return 1;
		}
		const permissions = voiceChannel.permissionsFor(client.user);
		if (!permissions.has(PermissionFlagsBits.Connect)) {
			this.channel.send(':no_entry:  Je n\'ai pas la permission de rejoindre le channel');
			return 1;
		}
		if (!permissions.has(PermissionFlagsBits.Speak)) {
			this.channel.send(':no_entry:  Je n\'ai pas la permission de parler dans le channel');
			return 1;
		}
		joinVoiceChannel({ channelId: member.voice.channel.id, guildId: this.guild.id, adapterCreator: this.guild.voiceAdapterCreator });
		this.voiceChannel = voiceChannel;
		getVoiceConnection(this.guild.id).subscribe(this.audio);
	}

	leave() {
		this.voiceChannel = null;
		getVoiceConnection(this.guild.id).destroy();
	}

	show(user, guild) {
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
			.setTitle(`Lecteur musical de __**${guild.name}**__`);

		switch (this.audio._state.status) {
			case 'idle':{
				embed.setDescription('La playlist est vide')
					.setThumbnail('https://imgur.com/RSc1nz1.png')
					.setImage('https://imgur.com/13nB881.png');
				break;
			}
			case 'playing':{
				const metadata = this.player.queue[0].metadata;
				embed.setDescription(`Joue actuellement **${metadata.title}** de **${metadata.author.name}**`)
					.setThumbnail('https://imgur.com/cxC9flw.png')
					.setImage('https://i.imgur.com/ayiVJSS.gif');
				break;
			}
		}
		return embed;
	}
}

async function GetAudioPlayer(client, guild) {
	let playerToBeReturned = null;
	client.MusicPlayers.forEach(player => {
		if (player.guild.id == guild.id) playerToBeReturned = player;
	});
	return playerToBeReturned;
}

async function CreateAudioPlayer(client, guild, channel) {
	const player = new MusicPlayer(guild, channel);
	client.MusicPlayers.push(player);
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return player;
}

module.exports = { MusicPlayer, GetAudioPlayer, CreateAudioPlayer };