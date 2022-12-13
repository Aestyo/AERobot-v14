const { createReadStream } = require('node:fs');
const { getVoiceConnection, createAudioPlayer, createAudioResource, StreamType, joinVoiceChannel } = require('@discordjs/voice');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { humanUnitSize } = require('../utils/unitSize');
const ytdl = require('ytdl-core');
const ytquery = require('yt-search');
const fs = require('fs');

async function GetAudioPlayer(client, interaction) {
	let playerToBeReturned = null;
	client.audioPlayers.forEach(player => {
		if (player.guild == interaction.guild.id) {
			playerToBeReturned = player;
		}
	});
	if (!playerToBeReturned) {
		return CreateAudioPlayer(client, interaction);
	} else {
		return playerToBeReturned;
	}
}

async function CreateAudioPlayer(client, interaction) {
	const answer = await interaction.channel.send(`<a:loading:1051599264498851852> Création du lecteur pour **${interaction.guild.name}**`);
	const player = createAudioPlayer();
	player.guild = interaction.guild.id;
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

				interaction.channel.send({ embeds: [exampleEmbed] });
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
	answer.edit(`<:Yes:1051950543997763748> Lecteur connecté à **${interaction.guild.name}**`);
	return player;
}

function JoinChannel(interaction, player) {
	const voiceChannel = interaction.member.voice.channel;
	if (!voiceChannel) {
		interaction.editReply(':no_entry:  Impossible de rejoindre le salon vocal');
		return 1;
	}
	const permissions = voiceChannel.permissionsFor(interaction.client.user);
	if (!permissions.has(PermissionFlagsBits.Connect)) {
		interaction.editReply(':no_entry:  Je n\'ai pas la permission de rejoindre le channel');
		return 1;
	}
	if (!permissions.has(PermissionFlagsBits.Speak)) {
		interaction.editReply(':no_entry:  Je n\'ai pas la permission de parler dans le channel');
		return 1;
	}
	joinVoiceChannel({ channelId: interaction.member.voice.channel.id, guildId: interaction.guild.id, adapterCreator: interaction.guild.voiceAdapterCreator });
	player.voiceChannel = voiceChannel;
}

async function FindSong(interaction, query) {
	const videoResult = await ytquery(query);
	const choices = (videoResult.videos.length > 2) ? [ videoResult.videos[0], videoResult.videos[1], videoResult.videos[2] ] : null;

	const exampleEmbed = new EmbedBuilder()
		.setURL('https://github.com/Aestyo/AERobot')
		.setAuthor({
			name: `${interaction.user.tag}`,
			iconURL: interaction.user.avatarURL(),
			url: `https://discordapp.com/users/${interaction.user.id}`,
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
	const message = await interaction.channel.send({ embeds: [exampleEmbed] });
	/* message.react('1️⃣').then(
		message.react('2️⃣').then(
			message.react('3️⃣'),
		),
	);*/
	message.delete();
	interaction.channel.send(`<:Yes:1051950543997763748> Titre validé : **${choices[0].title}**`);
	return choices[0];
}

async function DownloadSong(interaction, song) {
	if (!fs.existsSync(`./cache/${song.title}.webm`)) {
		const answer = await interaction.channel.send(`<a:loading:1051599264498851852> Téléchargement de  **${song.title}**`);
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

function PlaySong(interaction, player, song) {
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

function ShowPlayer(interaction, player) {
	console.log(player);
	const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Some title')
		.setURL('https://discord.js.org/')
		.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
		.setDescription('Some description here')
		.setThumbnail('https://i.imgur.com/AfFp7pu.png')
		.addFields(
			{ name: 'Regular field title', value: 'Some value here' },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Inline field title', value: 'Some value here', inline: true },
			{ name: 'Inline field title', value: 'Some value here', inline: true },
		)
		.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
		.setImage('https://i.imgur.com/AfFp7pu.png')
		.setTimestamp()
		.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

	return exampleEmbed;
}

module.exports = { GetAudioPlayer, JoinChannel, FindSong, DownloadSong, ShowPlayer, PlaySong };