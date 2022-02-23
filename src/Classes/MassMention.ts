import { Message } from 'eris';
import { Bot } from '../Client/Client';
import AutoMod from './AutoMod';

export default class MassMention extends AutoMod {

  async run(message: Message,): Promise<Boolean> {
    const regex = new RegExp('<@!*&*[0-9]+>');
    const guildSchema = (await this.client.utils.getGuildSchema(message.guildID))!;
    if(message.content.match(regex)) {

      if(message.mentions.length >= guildSchema?.Moderation['mentionAmount']) {
        message.delete('Mentioning to many users!');
        return true;
      }
      return false;
    } else {
      return false;
    }
  }


}