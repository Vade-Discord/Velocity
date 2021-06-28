import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import main_schema from "../../Schemas/Main Guilds/GuildSchema";
import fetch from "node-fetch";

export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "binary", {
      description: "Convert text to and from binary encryption.",
      category: "Utility",
      guildOnly: true,
    });
  }
  async run(message, args) {
    // if (message.channel.type !== "text") return;
    if (!args[0] || !["encode", "decode"].includes(args[0].toLowerCase()))
      return message.channel.createMessage(
        `You need to provide either "encode" or "decode".`
      );
    const text = args.slice(1)?.join(" ");
    if (!text)
      return message.channel.createMessage(
        `You need to provide text with the Command!`
      );
    if (text.length > 228)
      return message.channel.createMessage(
        `You cannot provide more than 228 characters due to Discords limitations.`
      );
    return message.channel.createMessage(
      {
        encode(char) {
          return char
            .split(" ")
            .map((str) => str.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");
        },
        decode(char) {
          return char
            .split(" ")
            .map((str) => String.fromCharCode(Number.parseInt(str, 2)))
            .join("");
        },
      }[args[0].toLowerCase()](text)
    );
  }
}
