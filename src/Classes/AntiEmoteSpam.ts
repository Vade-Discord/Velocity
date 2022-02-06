import { Message } from "eris";
import { Bot } from "../Client/Client";
import nodeEmoji from 'node-emoji';
import AutoMod from "./AutoMod";
export default class AntiEmoteSpam extends AutoMod {

    async run(message: Message,): Promise<Boolean> {
        const regex = new RegExp('^(?:<a?:\w{2,32}:)?(\d{17,19})>?$', 'gi')

        const args = message.content.trim().split(/ +/g);
        const guildSchema = (await this.client.utils.getGuildSchema(message.guildID));
        const verifyEmoji = emoji => {
            if (emoji.includes(':')) return  /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/g.test(emoji);
            return !!nodeEmoji.find(emoji);

        };
        const emojis = args.filter(verifyEmoji);
        if(emojis.length >= guildSchema.Moderation.emoteAmount) {
            message.delete("Sending to many emotes!");

            return true
        }  else {
            return false
        }

    }

}

