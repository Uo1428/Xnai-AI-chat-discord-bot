import type { event } from '@src/@types/event';
import readyEvent from './Client/ready';
import messageCreate from './Message/messageCreate';
import interactionCreateEvent from './Client/interactionCreate';

export const events: event[] = [
	{
		name: 'ready',
		runOnce: true,
		execute: readyEvent,
	},
	{
		name: 'messageCreate',
		execute: messageCreate,
	},
	{
		name: 'interactionCreate',
		execute: interactionCreateEvent,
	},
];
