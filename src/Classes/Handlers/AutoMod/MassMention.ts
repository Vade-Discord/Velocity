import { Message } from 'eris';
import AutoMod from './AutoMod';

export class MassMention extends AutoMod {

  public async Run(message: Message): Promise<boolean>{
    const regex = new RegExp('<@!*&*[0-9]+>');
    const guildSchema = await this.client.utils.getGuildSchema(message.guildID);
    if(message.content.match(regex)) {
            
      if(message.mentions.length >= guildSchema.Moderation.mentionAmount) {
        message.delete('Mentioning to meny user!');
    
        return true;
      } 
      return false;
    } else {
      return false;
    }
  }
    
}