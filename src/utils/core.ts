/**
 * @developer @uoaio discord.uoaio.xyz 
 */
import type { Guild, GuildMember } from 'discord.js';
import { stripIndent } from 'common-tags';
import { Groq } from 'groq-sdk';

export const validateGroqApiKey = async (apiKey: string) => {
	try {
		const test_llm = new Groq({
			apiKey: apiKey,
			maxRetries: 3,
		});
		const test_data = {
			messages: [
				{
					role: 'user',
					content: 'Explain the importance of fast language models',
				},
			],
			model: 'mixtral-8x7b-32768',
			temperature: 0.1,
			max_tokens: 128,
			top_p: 1,
			stream: false,
			stop: '.',
		};
		const response = await test_llm.chat.completions.create(test_data);
		// console.log(response)
		if (!response) return false;

		return true; // API key is valid
	} catch (error) {
		return false; // Request failed or API key is invalid
	}
};

export const getMemberInfo = (member: GuildMember | null) => {
	if (!member) throw 'Member Not provided';
	return {
		date: new Date().toISOString(),
		displayName: member.displayName,
		username: member.user.username,
		id: member.id,
		mention: `<@${member.id}>`,
		banable: member.bannable,
		isAdmin: member.permissions.has('Administrator'),
		server: {
			ownerId: member.guild.ownerId,
			id: member.guild.id,
			name: member.guild.name,
			membersCount: member.guild.memberCount,
		},
	};
};

export const getFormatMessage = (): string => {
	return stripIndent`Message Foramets:
Italics: *italics* or *italics*
Bold: **bold**
Underline: __underline__
Strikethrough: ~~strikethrough~~
Bold Italics: ***bold italics***
Underline Italics: __*underline italics*__
Underline Bold: __**underline bold**__
Header: Use # for a big header, ## for a smaller header, or ### for an even smaller header as the first character(s) in a new line.
Masked Links: [Link](Text)
Bulleted List: Use - or * in the beginning of each line.
Ordered List: Add line items with numbers followed by periods eg 1. 2. 
Code Blocks: Wrap your text in backticks (\`) or use three backticks (\`\`\`) for multiline code blocks.
Block Quotes: Use > or >>> followed by a space at the beginning of a line of text.
Spoiler Tags: Use \`||\` around your text or type \`/spoiler\` before your message.
Syntax Highlighting: Denote a specific language for syntax highlighting by typing the name of the language right after the first three backticks beginning your code block. eg autohotkey, diff, ini, md, py, js, yml`;
};

export const getGuildEmojis = (guild: Guild) => {
	return guild.emojis.cache
		.map(emoji =>
			JSON.stringify({
				id: emoji.id,
				name: emoji.name,
				mention: `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`,
			}),
		)
		.join(', ');
};
