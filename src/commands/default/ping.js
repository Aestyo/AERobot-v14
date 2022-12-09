const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ping = require('ping');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Effectue une requête de ping et affiche la latence enregistrée')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

	async execute(client, interaction) {
		const firstEmbed = new EmbedBuilder().setTitle('⏳ Mesure de la latence en cours').setColor('4C59EB');

		const message = await interaction.reply({ embeds: [firstEmbed], fetchReply: true });

		const pingresult = await ping.promise.probe('8.8.8.8');

		const embed = new EmbedBuilder()
			.setTitle('Mesure de vitesse de la connexion :')
			.setColor('4C59EB')
			.setThumbnail(client.user.displayAvatarURL())
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
					name: 'Temps de réaction du bot',
					value: `\`\`\`${message.createdTimestamp - interaction.createdTimestamp} ms\`\`\``,
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