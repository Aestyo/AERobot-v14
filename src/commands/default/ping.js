const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

	async execute(interaction) {
		await interaction.reply('ça marche on dirait!');
	},

	async run(message) {
		await message.reply('ça marche on dirait!');
	},
};