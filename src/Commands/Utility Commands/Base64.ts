import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import main_schema from "../../Schemas/Main Guilds/GuildSchema";
import fetch from "node-fetch";

export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "base64", {
      description: "Endcode and decode to base 64",
      category: "Utility",
      guildOnly: true,
    });
  }
  async run(message, args) {
    const method = args[0];
    if (
      !method ||
      (method.toLowerCase() !== "encode" && method.toLowerCase() !== "decode")
    )
      return message.channel.createMessage(
        `You need to specify either \`encode\` or \`decode\`.`
      );
    const text = args.slice(1).join(" ");
    if (!text)
      return message.channel.createMessage(
        `You need to specify some text to encode/decode.`
      );

    if (method == "encode") {
      const base64en = new RichEmbed()
        .setColor(`#f3f0f0`)
        .setDescription(Buffer.from(text).toString("base64"));
      message.channel.createMessage({ embed: base64en });
    } else if (method == "decode") {
      const base64dec = new RichEmbed()
        .setColor(`#f3f0f0`)
        .setDescription(Buffer.from(text, "base64").toString("ascii"));
      message.channel.createMessage({ embed: base64dec });
    }
  }
}
