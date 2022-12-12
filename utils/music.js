const { createReadStream } = require('node:fs');
const { getVoiceConnection, createAudioPlayer, createAudioResource, StreamType, joinVoiceChannel } = require('@discordjs/voice');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
	client.audioPlayers.push(player);
	await new Promise((resolve) => setTimeout(resolve, 1000));
	answer.edit('<:Yes:1051950543997763748> Lecteur crée avec succès');
	return player;
}

function JoinChannel(interaction) {
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
	interaction.editReply(`<:Yes:1051950543997763748> **${interaction.member.voice.channel.name}** connecté`);
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
	return choices[0];
}

async function DownloadSong(interaction, song) {
	const answer = await interaction.channel.send(`<a:loading:1051599264498851852> Téléchargement de  **${song.title}**`);
	return new Promise((resolve) => {
		const stream = ytdl(song.url, { filter: 'audioonly', audioBitrate: 128, format: 'webm', audioCodec: 'opus' });
		stream.pipe(fs.createWriteStream(`./cache/${song.title}.webm`));
		stream.on('finish', function() {
			answer.edit('<:Yes:1051950543997763748> Vidéo téléchargée');
			resolve(`./cache/${song.title}.webm`);
		});
	});
}

function PlaySong(interaction, player, song) {
	const resource = createAudioResource(createReadStream(song, {
		inputType: StreamType.OggOpus,
	}));
	resource.playStream.on('error', error => {
		console.error('Error:', error.message, 'with track', resource.metadata.title);
	});
	const connection = getVoiceConnection(interaction.guild.id);
	connection.subscribe(player);
	player.play(resource);
	console.log(player);
	console.log(connection);
	console.log(resource);
	console.log('jsuis arrivé au bout');
}

function ShowPlayer() {
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