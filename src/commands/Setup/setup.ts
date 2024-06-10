import type { commandExecute } from '@src/@types/command';
import ai from './subcommnads/ai';

const setCommand: commandExecute = {
	async slash(interaction) {
		const sub = interaction.options.getSubcommand();
		const cmds = {
			ai,
		};
		await cmds[sub as keyof typeof cmds](interaction);
	},
};

export { setCommand };
