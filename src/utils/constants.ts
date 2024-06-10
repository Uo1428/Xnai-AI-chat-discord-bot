export const categories = ['Admin', 'General'] as const;

export const integration_types = {
	USER_INSTALL: 1,
	GUILD_INSTALL: 0,
} as const;

export const integration_context = {
	GUILD: 0,
	BOT_DM: 1,
	PRIVATE_CHANNEL: 2,
} as const;

