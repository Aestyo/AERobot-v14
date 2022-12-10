// const log = require('../../../utils/logger');

module.exports = {
	name: 'interactionCreate',

	async execute(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		console.log(command);
		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},

};