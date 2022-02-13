import { Message } from 'eris';
import nodeEmoji from 'node-emoji';
import AutoMod from './AutoMod';
export class AntiEmoteSpam extends AutoMod {
  async Run(message: Message,): Promise<boolean> {
    const args = message.content.trim().split(/ +/g);
    const guildSchema = await this.client.utils.getGuildSchema(message.guildID);
    const verifyEmoji = emoji => {
      if (emoji.includes(':')) return /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/g.test(emoji);
      if (nodeEmoji.find(emoji)) return true;
      return false;
    };
    const emojis = args.filter(verifyEmoji);        
    if(emojis.length >= guildSchema.Moderation.emoteAmount) {
      message.delete('Sending to many emotes!');
    
      return true;
    } else {
      return false;
    }
  }

    
}