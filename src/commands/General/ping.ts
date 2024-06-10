import type { commandExecute } from '@src/@types/command';

export const pingCommand = {
	async slash(interaction) {
		await interaction.reply(
			`Pong! My ping is **${interaction.client.ws.ping}ms**.`,
		);
	},
} satisfies commandExecute;
