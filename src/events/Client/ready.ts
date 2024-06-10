import type { Events } from 'discord.js';
import type { eventExecute } from '@src/@types/event';

const readyEvent: eventExecute<Events.ClientReady> = async client => {
	console.log(`Bot ready! Logged in as ${client.user.tag}.`);
};

export default readyEvent;
