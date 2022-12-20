const log = require('./logger');
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');

async function download(user) {
	if (!fs.existsSync(`./cache/avatar_${user.tag}.png`)) {
		log.info(`Téléchargement de l'image de profil de ${user.tag}`);
		try {
			const file = fs.createWriteStream(`./cache/avatar_${user.tag}.webp`);
			await get_HTTPS(user.avatarURL({ size: 512, forceStatic: true }), file);
			log.success(`Image de profil de ${user.tag} téléchargée`);
			await sharp(`./cache/avatar_${user.tag}.webp`).toFile(`./cache/avatar_${user.tag}.png`)
				.catch(err => {
					console.log(err);
					return -1;
				});
			fs.unlinkSync(`./cache/avatar_${user.tag}.webp`, (err => {
				if (err) log.error(err);
			}));

		} catch (error) {
			log.error(`Impossible de télécharger la photo de profil de ${user.tag}`);
		}
	}
}

async function get_HTTPS(url, file) {
	return new Promise((resolve) => {
		https.get(url, function(response) {
			response.pipe(file);
			file.on('finish', async () => {
				file.close;
				resolve('finished');
			});
		});
	});
}


module.exports = { download };