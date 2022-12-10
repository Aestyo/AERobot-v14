const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ping = require('ping');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Effectue une requête de ping et affiche la latence enregistrée')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

	async execute(client, interaction) {
		await interaction.deferReply();
		const pingresult = await ping.promise.probe('8.8.8.8');
		const embed = new EmbedBuilder()
			.setTitle('Mesure de vitesse de la connexion :')
			.setColor('4C59EB')
			.addFields(
				{
					name: 'Latence Bot <-> API Discord',
					value: `\`\`\`${client.ws.ping} ms\`\`\``,
					inline: false,
				},
				{
					name: 'Latence Bot <-> Google',
					value: `\`\`\`${pingresult.time} ms\`\`\``,
					inline: false,
				},
				{
					name: 'Uptime',
					value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
					inline: false,
				},
			)
			.setTimestamp();
		interaction.editReply({ embeds: [embed] });
	},

	async run(message) {
		await message.reply('ça marche on dirait!');
	},
};