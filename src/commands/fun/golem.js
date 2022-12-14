const { SlashCommandBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const avatar = require('../../../utils/avatar');
const log = require('../../../utils/logger');
const jimp = require('jimp');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('golem')
		.setDescription('Golemise un utilisateur')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addUserOption(option => option
			.setName('target')
			.setDescription('Personne à golemiser')
			.setRequired(true)),

	async execute(client, interaction) {
		await interaction.deferReply();
		const target = interaction.options.getMember('target');
		const image = await GenerateGolem(target.user);
		if (image == -1) {
			interaction.editReply('Erreur lors de la création du golem.');
		}
		const attachment = new AttachmentBuilder(`./cache/golem_${target.user.tag}.png`, { name: `${image}.png` });
		log.info(`${target.user.tag} est un golem`);
		interaction.editReply({ content: 'GROS GOLEM', files: [attachment] });
	},

	async run(client, message, args) {
		let target;
		try {
			target = await client.users.fetch(args[0].slice(2, -1));
			target = await client.users.cache.get(args[0].slice(2, -1));
		} catch {
			message.reply(`Impossible de récupérer l'utilisateur ${args[0]}`);
			return;
		}

		const image = await GenerateGolem(target);

		if (image == -1) {
			message.reply('Erreur lors de la création du golem.');
		}
		const attachment = new AttachmentBuilder(`./cache/golem_${target.tag}.png`, { name: `${image}.png` });
		log.info(`${target.tag} est un golem`);
		message.reply({ content: 'GROS GOLEM', files: [attachment] });
	},
};

async function GenerateGolem(user) {
	const golemId = Math.floor(Math.random() * 11 + 1);
	let x, y, scale, flip;

	fs.readFile('./etc/golems.json', 'utf8', (err, jsonString) => {
		if (err) {
			log.error(`Erreur lors de l'ouverture de /etc/golems.json : ${err}`);
			return;
		}
		const data = JSON.parse(jsonString);
		data.forEach(golem => {
			if (golem.id == golemId) {
				x = golem.x;
				y = golem.y;
				scale = golem.scale;
				flip = golem.flip;
			}
		});
	});

	if (await avatar.download(user) == -1) {
		return -1;
	}

	const images = [`./media/golem/${golemId}.png`, `./cache/avatar_${user.tag}.png`];
	const jimps = [];
	images.forEach((img) => {
		jimps.push(jimp.read(img));
	});
	await Promise.all(jimps)
		.then(function() {
			return Promise.all(jimps);
		})
		.then(async function(data) {
			await data[1].resize(450, 450);
			await data[1].scale(scale);
			await data[1].flip(flip, false);
			await data[0].composite(data[1], x, y);
			await data[0].writeAsync(`./cache/golem_${user.tag}.png`);
		});
}
