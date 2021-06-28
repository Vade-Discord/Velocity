import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import main_schema from "../../Schemas/Main Guilds/GuildSchema";
import fetch from "node-fetch";

export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "advice", {
      aliases: ["advice", "advice"],
      description: "View the server information!",
      category: "Utility",
      guildOnly: true,
    });
  }
  async run(message, args) {
    try {
      const advice = await fetch("https://api.adviceslip.com/advice").then(
        (response) => response.json()
      );
      const embed = new RichEmbed()
        .setTitle(`${advice.slip.advice}`)
        .setColor("#f3f0f0")
        .setFooter(`Vade | Advice`, this.client.user.avatarURL)
        .setTimestamp();
      message.channel.createMessage({ embed: embed });
    } catch (err) {
      console.log(err);
      return message.channel.createMessage(
        "Error occurred! I have automatically sent this my developers, so no need to worry!"
      );
    }
  }
}
