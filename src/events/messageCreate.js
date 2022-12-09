module.exports = {
	name: 'messageCreate',
	async execute(interaction) {
		if (interaction.content.startsWith('&')) {
			console.log(interaction.content);
		}
	},
};