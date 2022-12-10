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
		const attachment = new AttachmentBuilder(`./cache/golem_${target.user.tag}.png`, { name: `${image}.png` });
		interaction.editReply({ content: 'GROS GOLEM', files: [attachment] });
	},
};

async function GenerateGolem(user) {
	const golemId = Math.floor(Math.random() * 6 + 1);
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

	await avatar.download(user);

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
			await data[1].scale(scale);
			await data[1].flip(flip, false);
			await data[0].composite(data[1], x, y);
			await data[0].writeAsync(`./cache/golem_${user.tag}.png`);
		});
}
