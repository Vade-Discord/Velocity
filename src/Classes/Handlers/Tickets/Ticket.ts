import { Bot } from '../../../Client/Client';


export default class Tickets {
  public readonly client: Bot;
  constructor(client: Bot) {
    this.client = client;
  }
}