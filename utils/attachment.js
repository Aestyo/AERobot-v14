const log = require('./logger');
const { humanFileSize } = require('./fileSize');
const https = require('https');
const fs = require('fs');

async function download(attachments) {
	let str = '';
	attachments.forEach(async attachment => {
		str += `[${attachment.name}] `;
		log.info(`Téléchargement du fichiers : ${attachment.name} (${humanFileSize(attachment.size, true)}) ...`);
		try {
			const file = fs.createWriteStream(`./cache/attachment_${attachment.id}_${attachment.name}`);
			await get_HTTPS(attachment.url, file);
			log.success(`Fichier ${attachment.name} téléchargé`);
		} catch (error) {
			log.error(`Impossible de télécharger ${attachment.name}`);
		}
	});
	return str;
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