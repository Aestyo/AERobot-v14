const log = require('./logger');
const { humanFileSize } = require('./fileSize');
const https = require('https');
const fs = require('fs');

async function download(attachments) {
	let str = '';
	attachments.forEach(attachment => {
		str += `[${attachment.name}] `;
		log.info(`Téléchargement du fichiers : ${attachment.name} (${humanFileSize(attachment.size, true)}) ...`);
		try {
			const file = fs.createWriteStream(`./cache/attachment_${attachment.id}_${attachment.name}`);
			https.get(attachment.url, function(response) {
				response.pipe(file);
				file.on('finish', async () => {
					file.close();
					log.success(`Fichier ${attachment.name} téléchargé`);
				});
			});
		} catch (error) {
			log.error(`Impossible de télécharger ${attachment.name}`);
		}
	});
	return str;
}

module.exports = { download };