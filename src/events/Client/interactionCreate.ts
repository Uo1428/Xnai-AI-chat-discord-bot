import type { Events } from 'discord.js';

import db, { cache } from '@src/databse/localdb';
import keys from '@src/databse/keys';
import { getAIResponse } from '@utils/llm';
import { commands } from '@src/commands';
import type { eventExecute } from '@src/@types/event';

const interactionCreateEvent: eventExecute<Events.InteractionCreate> =
	async interaction => {
		if (interaction.isButton()) {
			if (interaction.customId.startsWith('AI:')) {
				const [, btn, userID] = interaction.customId.split(':');

				if (userID !== interaction.user.id) {
					return await interaction.reply({
						ephemeral: true,
						content: 'that button is not for you',
					});
				}

				if (btn === 'Delete') {
					await interaction.deferReply({
						ephemeral: true,
					});
					const key = `${keys.AI}:${interaction.user.id}`;
					const key2 = `${keys.AI_Regen}:${interaction.user.id}`;

					await db.set(key2, null);
					await db.set(key, null);
					await cache.set(key, null);

					await interaction
						?.editReply({
							content: '✅ Successfully deleted all your conversation',
						})
						.catch(() => '');
				} else if (btn === 'Regen') {
					const history = (
						await db.get(
							`${keys.AI_Regen}:${interaction.user.id}:${interaction.message.id}`,
						)
					) as unknown as [[string, string]];

					if (!history) {
						return await interaction.reply({
							ephemeral: true,
							content: 'Chat history not found',
						});
					}

					interaction?.deferUpdate().catch(() => '');

					const ai_reponse = await getAIResponse(
						'[Regenerate your response]',
						history,
						{
							author: interaction.user,
						},
					);

					if (ai_reponse.error) return;

					await interaction.message.edit({
						content: ai_reponse.send?.content.toString(),
					});
				}
			}
		}

		if (!interaction.isChatInputCommand()) return;

		const command = commands.find(cmd => cmd.name === interaction.commandName);

		if (!command)
			interaction.client.application.commands.delete(interaction.commandName);

		if (!command) {
			console.error('No matching command found.');
			return;
		}

		try {
			await command.execute.slash(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'An error occurred while executing your command.',
				ephemeral: true,
			});
		}
	};

export default interactionCreateEvent;
