module.exports = {
	name: 'messageCreate',
	async execute(client, interaction) {
		if (interaction.content.startsWith('&')) {
			console.log(interaction.content);
		}
	},
};