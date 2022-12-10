const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Effectue un sondage avec les choix donnés')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addStringOption(option => option
			.setName('title')
			.setDescription('Titre du sondage à effectuer, généralement la question à poser')
			.setRequired(true))
		.addBooleanOption(option => option
			.setName('y-n')
			.setDescription('Est-ce que c\'est une question fermée ? ( Oui / Non )')
			.setRequired(true))
		.addStringOption(option => option
			.setName('choice1')
			.setDescription('Choix n°1')
			.setRequired(false))
		.addStringOption(option => option
			.setName('choice2')
			.setDescription('Choix n°2')
			.setRequired(false))
		.addStringOption(option => option
			.setName('choice3')
			.setDescription('Choix n°3')
			.setRequired(false))
		.addStringOption(option => option
			.setName('choice4')
			.setDescription('Choix n°4')
			.setRequired(false))
		.addStringOption(option => option
			.setName('choice5')
			.setDescription('Choix n°5')
			.setRequired(false))
		.addStringOption(option => option
			.setName('choice6')
			.setDescription('Choix n°6')
			.setRequired(false))
		.addStringOption(option => option
			.setName('choice7')
			.setDescription('Choix n°7')
			.setRequired(false))
		.addStringOption(option => option
			.setName('choice8')
			.setDescription('Choix n°8')
			.setRequired(false)),

	async execute(client, interaction) {
		const pollQuestion = interaction.options.getString('title');
		const pollYesNo = interaction.options.getBoolean('y-n');
		const pollChoices = [
			interaction.options.getString('choice1'),
			interaction.options.getString('choice2'),
			interaction.options.getString('choice3'),
			interaction.options.getString('choice4'),
			interaction.options.getString('choice5'),
			interaction.options.getString('choice6'),
			interaction.options.getString('choice7'),
			interaction.options.getString('choice8'),
		];
		const pollEmojis = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:'];
		const pollEmojisReact = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];

		if (pollQuestion.includes('http://') || pollQuestion.includes('https://') || pollQuestion.includes('www')) {
			interaction.reply({ content: ':no_entry: Commande incorrecte ! La question d\'un sondage ne peut pas contenir un lien.', ephemeral: true });
			return;
		}

		let isAllNull = 0;
		let isAllStacked = false;

		pollChoices.forEach((choice) => {
			if (choice == null) {
				isAllNull++;
			} else if (choice.includes('http://') || choice.includes('https://') || choice.includes('www')) {
				interaction.reply({ content: ':no_entry: Commande incorrecte ! Un choix de sondage ne peut pas contenir un lien.', ephemeral: true });
				return;
			}
		});
		if (isAllNull == 7 && !pollYesNo) {
			interaction.reply({ content: ':no_entry: Commande incorrecte ! Il faut au minimum **deux choix** pour effectuer un sondage.', ephemeral: true });
			return;
		}

		while (!isAllStacked) {
			for (let i = 1; i <= 8; i++) {
				if (pollChoices[i] != null && pollChoices[i - 1] == null && i - 1 != 0) {
					console.log(`Choix ${i + 1} -> Choix ${i}`);
					pollChoices[i - 1] = pollChoices[i];
					pollChoices[i] = null;
				}
			}

			let temporaire = 0;
			for (let i = 0; i < 8 - isAllNull; i++) {
				if (pollChoices[i] != null) {
					temporaire++;
				}
			}
			if (temporaire == 8 - isAllNull) {
				isAllStacked = true;
			}
		}

		const embed = new EmbedBuilder()
			.setTitle(`__Question :__ **${pollQuestion}**`)
			.setColor('#4C59EB')
			.setDescription('Répondez en réagissant avec les émojis ci-dessous :')
			.setTimestamp()
			.setFooter({ text: `Sondage généré par ${interaction.user.tag}` })
			.setAuthor({
				name: `${interaction.user.username} vous pose une question :`,
				iconURL: interaction.user.displayAvatarURL(),
				url: `https://discord.com/users/${interaction.user.id}`,
			});

		if (pollYesNo) {
			embed.addFields([
				{
					name: 'Oui :',
					value: '✅',
					inline: true,
				},
				{
					name: 'Non :',
					value: '❌',
					inline: true,
				},
			]);
		} else {
			let i = 1;
			pollChoices.forEach((choice) => {
				if (choice) {
					embed.addFields([
						{
							name: `${i}) ${choice} :`,
							value: `${pollEmojis[i]}`,
							inline: false,
						},
					]);
				}
				i++;
			});
		}

		const poll = await interaction.reply({ embeds: [embed], fetchReply: true });

		if (pollYesNo) {
			poll.react('✅');
			poll.react('❌');
		} else {
			let i = 1;
			pollChoices.forEach((choice) => {
				if (choice) {
					poll.react(pollEmojisReact[i]);
				}
				i++;
			});
		}
	},

	async run(client, message) {
		message.reply(':no_entry: Cette commande n\'est plus disponible en commande préfix. Utilisez la commande slash à la place.');
	},
};
