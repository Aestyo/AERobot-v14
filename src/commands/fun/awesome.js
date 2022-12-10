const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('awesome')
		.setDescription('AWESOME CAR')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

	async execute(client, interaction) {
		interaction.reply(`https://awesomecars.neocities.org/images/car%20(${Math.floor(Math.random() * 338)}).mp4`);
	},

	async run(client, message) {
		message.reply(`https://awesomecars.neocities.org/images/car%20(${Math.floor(Math.random() * 338)}).mp4`);
	},
};
