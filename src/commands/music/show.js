const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show')
		.setDescription('Commandes relatives aux commandes musicales')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async function(client, interaction) {
		interaction.reply('Pas encore implémenté UwU');
	},

	run: async function(client, message) {
		message.reply('Pas encore implémenté UwU');
	},

};