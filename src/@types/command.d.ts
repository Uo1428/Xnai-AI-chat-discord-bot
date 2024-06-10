import type { categories, integration_context, integration_types } from '@utils/constants';
import type {
	ApplicationCommandOptionData,
	BaseInteraction,
	ChatInputCommandInteraction,
	CommandOptionSubOptionResolvableType,
	Interaction,
	Message,
	PermissionOverwriteResolvable,
	PermissionResolvable,
} from 'discord.js';

type commandExecute = {
	prefix?: (message: Message, args: string[]) => Promise<any>;
	slash: (interaction: ChatInputCommandInteraction) => Promise<any>;
};

interface command {
	name: string;
	description: string;
	cooldown?: number;
	category: (typeof categories)[number];
	permissions?: { user?: PermissionResolvable[]; bot?: PermissionResolvable[] };
	prefix: {
		enabled: boolean;
		alliases?: [];
		usage?: '';
		minArgs?: number;
		subcommands?: [];
	};
	slash: {
		enabled: boolean;
		ephemeral?: boolean;
		options?: ApplicationCommandOptionData[];
		integration_types?: Array<keyof typeof integration_types>;
		// | (typeof integration_types)[keyof typeof integration_types]
		contexts?: Array<keyof typeof integration_context>;
		// | (typeof integration_context)[keyof typeof integration_context]
	};
	execute: commandExecute;
}
