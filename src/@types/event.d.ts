import type { ClientEvents } from 'discord.js';

type eventExecute<T extends keyof ClientEvents> = (
	...args: ClientEvents[T]
) => Promise<any>;

interface event {
	name: keyof ClientEvents;
	runOnce?: boolean;
	execute: eventExecute<any>;
}