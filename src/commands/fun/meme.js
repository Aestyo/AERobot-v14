const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Affiche un meme récupéré sur Reddit !')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

	async execute(client, interaction) {
		const meme = await DownloadMeme();
		interaction.reply({ embeds: [meme] });
	},

	async run(client, message) {
		const meme = await DownloadMeme();
		message.reply({ embeds: [meme] });
	},
};

async function DownloadMeme() {
	return new Promise((resolve) => {
		https.get('https://meme-api.com/gimme', function(response) {
			let body = '';
			response.on('data', function(chunk) {
				body += chunk;
			});
			response.on('end', function() {
				const meme = JSON.parse(body);
				const memeEmbed = new EmbedBuilder()
					.setColor(0x4C59EB)
					.setTitle(meme.title)
					.setURL(meme.postLink)
					.setAuthor({ name: meme.author })
					.setImage(meme.url)
					.setThumbnail('https://www.redditinc.com/assets/images/site/reddit-logo.png')
					.setTimestamp()
					.setFooter({ text: 'Powered by Æstyo Corp.' });
				resolve(memeEmbed);
			});
		});
	});
}