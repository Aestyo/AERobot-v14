const log = require('../../../utils/logger');

module.exports = {
	name: 'rateLimit',
	once: false,
	async execute(client, rateLimitData) {
		log.warn('L\'API de Discord a restreint les action du bot !');
		log.warn(`Durée de la restriction : ${rateLimitData.timeout / 1000} secondes`);
		log.warn(`Nombre de requête maximales : ${rateLimitData.limit}`);
		log.warn(`Requête limitée : ${rateLimitData.method}`);
		log.warn(`Chemin de la requête : ${rateLimitData.path}`);
		log.warn(`Route de la requête : ${rateLimitData.route}`);
		log.warn(`Est-ce que la limitation est globale ? : ${rateLimitData.global}`);
	},
};
