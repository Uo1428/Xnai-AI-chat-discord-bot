import { ChatPromptTemplate } from '@langchain/core/prompts';
import { getFormatMessage, getGuildEmojis, getMemberInfo } from './core';
import {
	ActionRowBuilder,
	ButtonBuilder,
	type GuildMember,
	type Message,
	type User,
} from 'discord.js';
import db, { cache } from '@src/databse/localdb';
import keys from '@src/databse/keys';
import type { RunnableLike } from '@langchain/core/runnables';
import type { Client } from '@src/client';

export const getAIResponse = async (
	message: string,
	history: Array<[string, string]>,
	options: { author: GuildMember | User },
) => {
	const userConcur = userConcurreny(options.author);
	try {
		const h = JSON.parse(
			JSON.stringify(history).replaceAll('}', '}}').replaceAll('{', '{{'),
		);

		if (await userConcur.get()) {
			return {
				send: null,
				error: 'Your previous request is not completed yet!',
			};
		}

		userConcur.set(true);

		const prompt = ChatPromptTemplate.fromMessages([...h, ['human', message]]);

		const response = await prompt
			.pipe((options.author.client as Client).llm as unknown as RunnableLike)
			.invoke({});

		userConcur.set(false);

		const ai_reponse = response.content;

		if (!ai_reponse)
			return {
				send: null,
				error: 'Unable to generate response ',
			};

		return { send: response, error: null };
	} catch (e) {
		console.log(e);
		userConcur.set(false);
		return {
			send: null,
			error: (e as Error).message || 'Unable to generate response',
		};
	}
};

export const setSystemMessages = (
	messages: [[string, string]],
	options: { message: Message },
) => {
	const { message } = options;
	const system_messages = {
		User_Information: () => getMemberInfo(message.member),
		// 'Message Format (must follow)': () => ({ message: getFormatMessage() }),
		// 'Server Emotes': () =>
		// 	message.guild ? getGuildEmojis(message.guild) : 'Noting...',
	};

	const system_messages_keys = Object.keys(system_messages) as Array<
		keyof typeof system_messages
	>;

	for (const sys_msg of system_messages_keys) {
		if (
			!messages.find(
				(chat: string[]) =>
					chat[0] === 'system' && chat[1].startsWith(`[${sys_msg}]`),
			)
		) {
			const JSON_strigified = JSON.stringify(
				system_messages[sys_msg](),
				null,
				2,
			)
				.replaceAll('{', '{{')
				.replaceAll('}', '}}');
			messages.push(['system', `[${sys_msg}]\n${JSON_strigified}`]);
			break;
		}
	}

	return messages;
};

export const setButtons = (
	message: Message,
	chat_history: [[string, string]],
	options: { author: GuildMember },
) => {
	const { author } = options;
	const key = `${keys.AI_Regen}:${author.id}:${message.id}`;
	const regenrate = new ButtonBuilder()
		.setCustomId(`AI:Regen:${author.id}`)
		.setEmoji('789550228323172422')
		.setStyle(2);

	const row = new ActionRowBuilder().setComponents([regenrate]);

	db.set(key, chat_history);

	message.edit({
		components: [row as any],
	});
};

export const userConcurreny = (user: GuildMember | User) => {
	const key = `${keys.AI_User_Concerrncy}:${user.id}`;
	return {
		get: async () => await cache.get(key) || false,
		set: (value = true) => cache.set(key, value),
	};
};

export const removeButtons_LastRespose = async (
	message: Message,
	respondMessage: Message,
) => {
	const key = `${keys.AI_Last_Response}:${message.author.id}`;
	const data = await db.get(key);
	if (data) {
		const msg = message.channel.messages.cache.get(data);
		const regenKey = `${keys.AI_Regen}:${message.author.id}:${msg?.id}`;
		db.delete(regenKey);
		msg
			?.edit({
				components: [],
			})
			.catch(() => '');
	}
	db.set(key, respondMessage.id);
};
/**
 * @developer @uoaio discord.uoaio.xyz 
 */