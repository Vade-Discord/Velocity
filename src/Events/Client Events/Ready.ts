import type { RunFunction } from "../../interfaces/Event";
import type { Bot } from "../../client/Client";
import mongo from '../../Interfaces/Database';

export const run: RunFunction = async (
  client: Bot,
) => {
    await mongo();
    console.log(`${client.user.username}${client.user.discriminator} has successfully logged in!`);
    client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com"})

};

export const name: string = "ready";