const log = require('./logger');
const webp = require('webp-converter');
const https = require('https');
const fs = require('fs');

async function download(user) {
	if (!fs.existsSync(`./cache/avatar_${user.tag}.png`)) {
		log.info(`Téléchargement de l'image de profil de ${user.tag}`);
		try {
			const file = fs.createWriteStream(`./cache/avatar_${user.tag}.webp`);
			https.get(user.avatarURL({ size: 512, forceStatic: true }), function(response) {
				response.pipe(file);
				file.on('finish', async () => {
					file.close();
					log.success(`Image de profil de ${user.tag} téléchargée`);
					await webp.dwebp(`./cache/avatar_${user.tag}.webp`, `./cache/avatar_${user.tag}.png`, '-o');
					fs.unlink(`./cache/avatar_${user.tag}.webp`, (err => {
						if (err) log.error(err);
					}));
				});
			});
		} catch (error) {
			log.error(`Impossible de télécharger la photo de profil de ${user.tag}`);
		}
	}
}

module.exports = { download };