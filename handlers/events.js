const log = require('../utils/logger');
const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);

module.exports = async (client) => {
	let total = 0;
	(await pGlob(`${process.cwd()}/src/events/*/*.js`)).map(async (eventFile) => {
		const event = require(eventFile);

		if (!eventList.includes(event.name) || !event.name) {
			return log.warn(`Évènement incorrect, nom manquant ou incorrect : ${eventFile}`);
		}

		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
			total++;
		} else {
			client.on(event.name, (...args) => event.execute(client, ...args));
			total++;
		}
	});
	log.success(`${total} évènements chargés avec succès.`);
};

const eventList = [
	'apiRequest',
	'apiResponse',
	'channelCreate',
	'channelDelete',
	'channelPinsUpdate',
	'channelUpdate',
	'debug',
	'emojiCreate',
	'emojiDelete',
	'emojiUpdate',
	'error',
	'guildBanAdd',
	'guildBanRemove',
	'guildCreate',
	'guildDelete',
	'guildIntegrationsUpdate',
	'guildMemberAdd',
	'guildMemberAvailable',
	'guildMemberRemove',
	'guildMembersChunk',
	'guildMemberUpdate',
	'guildScheduledEventCreate',
	'guildScheduledEventDelete',
	'guildScheduledEventUpdate',
	'guildScheduledEventUserAdd',
	'guildScheduledEventUserRemove',
	'guildUnavailable',
	'guildUpdate',
	'interactionCreate',
	'invalidated',
	'invalidRequestWarning',
	'inviteCreate',
	'inviteDelete',
	'messageCreate',
	'messageDelete',
	'messageDeleteBulk',
	'messageReactionAdd',
	'messageReactionRemove',
	'messageReactionRemoveAll',
	'messageReactionRemoveEmoji',
	'messageUpdate',
	'presenceUpdate',
	'rateLimit',
	'ready',
	'roleCreate',
	'roleDelete',
	'roleUpdate',
	'shardDisconnect',
	'shardError',
	'shardReady',
	'shardReconnecting',
	'shardResume',
	'stageInstanceCreate',
	'stageInstanceDelete',
	'stageInstanceUpdate',
	'stickerCreate',
	'stickerDelete',
	'stickerUpdate',
	'threadCreate',
	'threadDelete',
	'threadListSync',
	'threadMembersUpdate',
	'threadMemberUpdate',
	'threadUpdate',
	'typingStart',
	'userUpdate',
	'voiceStateUpdate',
	'warn',
	'webhookUpdate',
];
