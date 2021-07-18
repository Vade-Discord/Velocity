import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import phin from "phin";

export default class CatCommand extends Command {
  constructor(client) {
    super(client, "cat", {
      description: "Recieve an image of a Cat!!",
      category: "Animals",
      guildOnly: true,
    });
  }
  async run(message, args) {
    try {
      let { body } = await phin<{ url: string }>({
        url: "https://api.thecatapi.com/v1/images/search",
        parse: "json",
      });

      const embed = new this.client.embed().setImage(body.url).setDescription(`[Click To View](${body.url})`);

      message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});
    } catch (err) {
      console.log(err);
      return message.channel.send(
        `Looks as if an error has occured. Try again later.`
      );
    }
  }
}
