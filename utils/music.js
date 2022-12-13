const { createReadStream } = require('node:fs');
const { getVoiceConnection, createAudioPlayer, createAudioResource, StreamType, joinVoiceChannel } = require('@discordjs/voice');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { humanUnitSize } = require('../utils/unitSize');
const ytdl = require('ytdl-core');
const ytquery = require('yt-search');
const fs = require('fs');

async function GetAudioPlayer(client, guild) {
	let playerToBeReturned = null;
	client.audioPlayers.forEach(player => {
		if (player.guild == guild.id) {
			playerToBeReturned = player;
		}
	});
	return playerToBeReturned;
}

async function CreateAudioPlayer(client, guild, channel) {
	const answer = await channel.send(`<a:loading:1051599264498851852> Création du lecteur pour **${guild.name}**`);
	const player = createAudioPlayer();
	player.guild = guild.id;
	player.voiceChannel = null;
	player.queue = new Array;
	player.addListener('stateChange', (oldOne, newOne) => {
		switch (newOne.status) {
			case 'idle':{
				break;
			}
			case 'playing':{
				const metadata = newOne.resource.metadata;
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x4C59EB)
					.setTitle(metadata.title)
					.setURL(metadata.url)
					.setAuthor({ name: 'En cours de lecture :' })
					.setDescription(`De ${metadata.author.name} - ${humanUnitSize(metadata.views)} vues - ${metadata.ago} \n\n${metadata.description}`)
					.setImage(metadata.image)
					.setTimestamp()
					.setFooter({ text: 'Powered by Æstyo Corp.' });

				channel.send({ embeds: [exampleEmbed] });
				break;
			}
			case 'paused':{
				break;
			}
			case 'buffering':{
				break;
			}
		}
		if (newOne.status == 'idle') {
			console.log('The song finished');
		}
	});
	client.audioPlayers.push(player);
	await new Promise((resolve) => setTimeout(resolve, 1000));
	answer.edit(`<:Yes:1051950543997763748> Lecteur connecté à **${guild.name}**`);
	return player;
}

function JoinChannel(client, channel, member, player) {
	const voiceChannel = member.voice.channel;
	if (!voiceChannel) {
		channel.send(':no_entry:  Impossible de rejoindre le salon vocal');
		return 1;
	}
	const permissions = voiceChannel.permissionsFor(client.user);
	if (!permissions.has(PermissionFlagsBits.Connect)) {
		channel.send(':no_entry:  Je n\'ai pas la permission de rejoindre le channel');
		return 1;
	}
	if (!permissions.has(PermissionFlagsBits.Speak)) {
		channel.send(':no_entry:  Je n\'ai pas la permission de parler dans le channel');
		return 1;
	}
	joinVoiceChannel({ channelId: member.voice.channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator });
	player.voiceChannel = voiceChannel;
}

async function FindSong(channel, user, query) {
	const videoResult = await ytquery(query);
	const choices = (videoResult.videos.length > 2) ? [ videoResult.videos[0], videoResult.videos[1], videoResult.videos[2] ] : null;

	const exampleEmbed = new EmbedBuilder()
		.setURL('https://github.com/Aestyo/AERobot')
		.setAuthor({
			name: `${user.tag}`,
			iconURL: user.avatarURL(),
			url: `https://discordapp.com/users/${user.id}`,
		})
		.setColor('#4C59EB')
		.setFooter({ text: 'Powered by Æstyo Corp.' })
		.setTimestamp()
		.setTitle('Menu de sélection :')
		.addFields(
			{ name: `:one: ${choices[0].title} (${choices[0].timestamp})`, value: `${choices[0].author.name}` },
			{ name: `:two: ${choices[1].title} (${choices[1].timestamp})`, value: `${choices[1].author.name}` },
			{ name: `:three: ${choices[2].title} (${choices[2].timestamp})`, value: `${choices[2].author.name}` },
		);
	const message = await channel.send({ embeds: [exampleEmbed] });
	/* message.react('1️⃣').then(
		message.react('2️⃣').then(
			message.react('3️⃣'),
		),
	);*/
	message.delete();
	channel.send(`<:Yes:1051950543997763748> Titre validé : **${choices[0].title}**`);
	return choices[0];
}

async function DownloadSong(channel, song) {
	if (!fs.existsSync(`./cache/${song.title}.webm`)) {
		const answer = await channel.send(`<a:loading:1051599264498851852> Téléchargement de  **${song.title}**`);
		return new Promise((resolve) => {
			const stream = ytdl(song.url, { filter: 'audioonly', audioBitrate: 128, format: 'webm', audioCodec: 'opus' });
			stream.pipe(fs.createWriteStream(`./cache/${song.title}.webm`));
			stream.on('finish', function() {
				answer.edit(`<:Yes:1051950543997763748> Téléchargement terminé de **${song.title}**`);
				resolve(song);
			});
		});
	} else {
		return song;
	}
}

function PlaySong(player, song) {
	const ressource = createAudioResource(createReadStream(`./cache/${song.title}.webm`), {
		inputType: StreamType.WebmOpus,
		metadata: {
			title: song.title,
			description: song.description,
			url: song.url,
			image: song.image,
			thumbnail: song.thumbnail,
			duration: song.duration,
			author: song.author,
			views: song.views,
			ago: song.ago,
		},
	});
	const connection = getVoiceConnection(player.guild);
	connection.subscribe(player);
	player.play(ressource);
	player.queue.push(ressource);
}

function ShowPlayer(user, guild, player) {
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

	switch (player._state.status) {
		case 'idle':{
			embed.setDescription('La playlist est vide')
				.setThumbnail('https://imgur.com/RSc1nz1.png')
				.setImage('https://imgur.com/13nB881.png');
			break;
		}
		case 'playing':{
			const metadata = player.queue[0].metadata;
			console.log(metadata);
			embed.setDescription(`Joue actuellement **${metadata.title}** de **${metadata.author.name}**`)
				.setThumbnail('https://imgur.com/cxC9flw.png')
				.setImage('https://i.imgur.com/ayiVJSS.gif');
			break;
		}
	}

	return embed;
}

module.exports = { GetAudioPlayer, CreateAudioPlayer, JoinChannel, FindSong, DownloadSong, ShowPlayer, PlaySong };