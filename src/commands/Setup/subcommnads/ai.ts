import keys from '@src/databse/keys';
import db from '@src/databse/localdb';
import type { ChatInputCommandInteraction } from 'discord.js';

export default async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
	const channel = interaction.options.getChannel('channel');
	if (!channel?.id) return;
	await db.set(`${keys.AI}:Guild:${interaction.guildId}`, channel?.id);
	interaction.guild?.channels.cache.get(channel?.id)?.edit({
		rateLimitPerUser: 10,
	});
	await interaction.editReply(
		`✅ Successfully updated the ai channel to <#${channel?.id}>.`,
	);
};
