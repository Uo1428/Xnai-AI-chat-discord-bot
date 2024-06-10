import type { command } from '@src/@types/command';
import { pingCommand } from './General/ping';
import {
	type ChatInputCommandInteraction,
	type CacheType,
	ApplicationCommandOptionType,
} from 'discord.js';
import { setCommand } from './Setup/setup';
import { ChannelType } from 'discord.js';

export const commands = [
	{
		name: 'ping',
		description: 'Ws of bot',
		category: 'General',
		cooldown: 0,
		permissions: {
			bot: ['SendMessages'],
			user: ['SendMessages'],
		},
		prefix: {
			enabled: false,
		},
		slash: {
			enabled: true,
			contexts: ['BOT_DM', 'GUILD', 'PRIVATE_CHANNEL'],
			integration_types: ['GUILD_INSTALL', 'USER_INSTALL'],
		},
		execute: pingCommand,
	},
	{
		name: 'setup',
		category: 'General',
		description: 'Setup different features',
		prefix: {
			enabled: false,
		},
		slash: {
			enabled: true,
			integration_types: ['GUILD_INSTALL'],
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'ai',
					description: 'Setup ai chat for this server',
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							name: 'channel',
							description: 'select a channel',
							channel_types: [ChannelType.GuildText],
							required: true,
						},
					],
				},
			],
		},
		execute: setCommand,
	},
] satisfies command[];
