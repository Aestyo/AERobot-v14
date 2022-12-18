const { createReadStream } = require('node:fs');
const { demuxProbe, createAudioResource } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const ytquery = require('yt-search');
const fs = require('fs');

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

async function PlaySong(player, song) {
	const { stream, type } = await demuxProbe(createReadStream(`./cache/${song.title}.webm`));
	const ressource = createAudioResource(stream, {
		inputType: type,
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
	player.play(ressource);
}

module.exports = { FindSong, DownloadSong, PlaySong };