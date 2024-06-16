import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import type { env as _env, } from './@types/env';

export const env = createEnv({
	runtimeEnv: process.env,
	server: {
		DISCORD_BOT_TOKEN: z.string(),
		DISCORD_CLIENT_ID: z.string(),
		DATABASE: z.enum(['JSON', 'MONGO']),
		MONGO: z.string().optional(),
		LLM_API: z.string(),
	},
}) as _env;


/**
 * @developer @uoaio discord.uoaio.xyz 
 */