import {
	Client as DiscordClient,
} from 'discord.js';
import { env as ENV } from './env';
import { Client } from './client';
import type { env } from './@types/env';

const client = new Client(ENV);


client.loadEvents()
client.start()
await client.deployCommands()



/**
 * @developer @uoaio discord.uoaio.xyz 
 */