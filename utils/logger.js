const chalk = require('chalk');
const dayjs = require('dayjs');

class logger {

	static error(content) {
		const timestamp = `[${dayjs().format('MMM-DD-YYYY HH:mm:ss')}]`;
		const stream = process.stderr;

		const log = `${chalk.white(timestamp)} ${chalk.hex('#FA3A44')('[ERROR]')} - ${chalk.white(content)}\n`;

		stream.write(log);
	}

	static warn(content) {
		const timestamp = `[${dayjs().format('MMM-DD-YYYY HH:mm:ss')}]`;
		const stream = process.stdout;

		const log = `${chalk.white(timestamp)} ${chalk.hex('#FAA81A')('[WARNING]')} - ${chalk.white(content)}\n`;

		stream.write(log);
	}

	static success(content) {
		const timestamp = `[${dayjs().format('MMM-DD-YYYY HH:mm:ss')}]`;
		const stream = process.stdout;

		const log = `${chalk.white(timestamp)} ${chalk.hex('#3BA55D')('[SUCCESS]')} - ${chalk.white(content)}\n`;

		stream.write(log);
	}

	static info(content) {
		const timestamp = `[${dayjs().format('MMM-DD-YYYY HH:mm:ss')}]`;
		const stream = process.stdout;

		const log = `${chalk.white(timestamp)} ${chalk.hex('#4C59EB')('[INFO]')} - ${chalk.white(content)}\n`;

		stream.write(log);
	}

	static init() {
		this.info(' _______  _______  _______  _______  ______   _______ _________');
		this.info('|  ___  ||  ____ \\|  ____ ||  ___  ||  ___ \\ |  ___  |\\__   __/');
		this.info('| |   | || |    \\/| |    ||| |   | || |   | || |   | |   | |   ');
		this.info('| |___| || |__    | |____||| |   | || |__/ / | |   | |   | |   ');
		this.info('|  ___  ||  __|   |     __|| |   | ||  __ |  | |   | |   | |   ');
		this.info('| |   | || |      | |\\ |   | |   | || |  \\ \\ | |   | |   | |   ');
		this.info('| |   | || |____/\\| | \\ \\__| |___| || |___\\ || |___| |   | |   ');
		this.info('|/     \\||_______/|/   \\__/|_______||______/ |_______|   |_|   ');
		this.info(' ');
	}
}

module.exports = logger;