import AI_Config from "@src/config/AI";
import db from "@src/databse/localdb";
import { ActionRowBuilder, ButtonBuilder, type Events } from "discord.js";
import {
  getAIResponse,
  removeButtons_LastRespose,
  setButtons,
  setSystemMessages,
} from "../../utils/llm";
import keys from "@src/databse/keys";
import AI from "@src/config/AI";
import type { eventExecute } from "@src/@types/event";

const messageCreate: eventExecute<Events.MessageCreate> = async (message) => {
  try {
    if (message.author.bot || !message.cleanContent || message.system) return;
    if (!message.guild || !message.member) return;

    const ai_channel = await db.get(`${keys.AI}:Guild:${message.guildId}`);

    if (ai_channel === message.channelId) {

      let cleanContent = message.cleanContent;

      const key = `AI:${message.author.id}`;
    
      const author_chat = await db.get(key) ?? [];
      setSystemMessages(author_chat, { message });

      if (message.reference?.messageId) {
        const msg = message.channel.messages.cache.get(
          message.reference.messageId
        );

        if (msg?.content)
          cleanContent += `\n[Reference Message]: {{ message: ${msg.content}, author: ${msg.author.username} }}`;
      }

      const prompt = [
        ["system", AI_Config.Prompt],
        ...author_chat,
      ] as unknown as [[string, string]];

      message.channel.sendTyping();

      const response = await getAIResponse(cleanContent, prompt, {
        author: message.member,
      });

      if (response.error || !response.send) {
        const delete_row = new ActionRowBuilder().setComponents([
          new ButtonBuilder()
            .setLabel("Reset")
            .setStyle(2)
            .setEmoji("979818265582899240")
            .setCustomId(`AI:Delete:${message.author.id}`),
        ]);
        return message
          .reply({
            content: response.error as string,
            components: [delete_row] as any,
          })
          .then((msg: { delete: () => void }) => {
            setTimeout(() => msg.delete(), 5000);
          });
      }
      const content =
        response.send.content?.length >= 1920
          ? `${response.send?.content.slice(0, 1997)}...`
          : response.send?.content.toString();

      const msg = await message.reply({ content });

      setButtons(msg, [...prompt, ["human", message.cleanContent]] as any, {
        author: message.member,
      });
      removeButtons_LastRespose(message, msg);

      const conversation = [
        ...author_chat.slice(-AI.Max_Conversation_History),
        ["human", message.cleanContent],
        ["ai", content],
      ];

      db.set(key, conversation);
    }
  } catch (E) {
    console.log(E);
  }
};

export default messageCreate;
