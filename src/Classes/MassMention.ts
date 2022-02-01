import { Message } from "eris";
import { Bot } from "../Client/Client";

export default async function MassMention(client: Bot, message: Message,): Promise<Boolean> {
    const regex = new RegExp('<@!*&*[0-9]+>')
    const guildSchema = await client.utils.getGuildSchema(message.guildID)
    if(message.content.match(regex)) {
        
        if(message.mentions.length >= guildSchema.Moderation.mentionAmount) {
            message.delete("Mentioning to meny user!")

            return true
        } 
        return false
    } else {
        return false
    }
}