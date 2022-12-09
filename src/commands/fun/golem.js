const { SlashCommandBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const avatar = require('../../../utils/avatar');
const jimp = require('jimp');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('golem')
		.setDescription('Golemise un utilisateur')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addUserOption(option => option
			.setName('target')
			.setDescription('Personne à golemiser')
			.setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply();
		const target = interaction.options.getMember('target');
		const image = await GOLEMISATION(target.user);
		const attachment = new AttachmentBuilder(`./cache/golem_${target.user.tag}.png`, { name: `${image}.png` });
		interaction.editReply({ content: 'GROS GOLEM', files: [attachment] });
	},
};

async function GOLEMISATION(user) {
	const golemId = Math.floor(Math.random() * 6 + 1);

	let x = 0,
		y = 0,
		scale = 1,
		flip = false;

	switch (golemId) {
	case 1: {
		x = 170;
		y = 60;
		scale = 0.15;
		break;
	}
	case 2: {
		x = 240;
		y = 130;
		scale = 0.375;
		flip = true;
		break;
	}
	case 3: {
		x = 70;
		y = 2;
		scale = 0.2;
		break;
	}
	case 4: {
		x = 200;
		y = 25;
		scale = 0.175;
		flip = true;
		break;
	}
	case 5: {
		x = 125;
		y = 25;
		scale = 0.1;
		break;
	}
	case 6: {
		x = 128;
		y = 40;
		scale = 0.15;
		flip = true;
		break;
	}
	}

	avatar.download(user);
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
			data[1].scale(scale);
			data[1].flip(flip, false);
			data[0].composite(data[1], x, y);
			data[0].write(`./cache/golem_${user.tag}.png`);
		});
}
