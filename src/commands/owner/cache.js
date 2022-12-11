const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// const log = require('../../../utils/logger');
const fileSize = require('../../../utils/fileSize');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cache')
		.setDescription('Commandes relatives au cache du bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('size')
				.setDescription('Affiche la taille du cache'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('clear')
				.setDescription('Vide le cache')),

	ownerOnly: true,

	execute: async function(client, interaction) {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'size':{
				interaction.editReply(getCacheSize());
				break;
			}
			case 'clear':{
				interaction.reply(clearCache());
				break;
			}
		}
	},

	run: async function(client, message, args) {
		switch (args[0]) {
			case 'size':{
				message.reply(getCacheSize());
				break;
			}
			case 'clear':{
				message.reply(clearCache());
				break;
			}
			default: {
				message.reply(':no_entry:  Commande incorrecte');
			}
		}
	},
};

function getCacheSize() {
	let number = 0, total = 0;
	const filenames = fs.readdirSync('./cache');
	filenames.forEach(file => {
		total += fs.statSync(path.join('./cache', file)).size;
		number++;
	});
	return `:wastebasket: Le cache contient **${number} éléments** pour un total de **${fileSize.humanFileSize(total, true)}**.`;
}

function clearCache() {
	let number = 0, total = 0;
	const filenames = fs.readdirSync('./cache');
	filenames.forEach(file => {
		total += fs.statSync(path.join('./cache', file)).size;
		number++;
		fs.unlinkSync(`./cache/${file}`);
	});
	return `:wastebasket: **${number} éléments supprimés** pour un total de **${fileSize.humanFileSize(total, true)}**.`;
}