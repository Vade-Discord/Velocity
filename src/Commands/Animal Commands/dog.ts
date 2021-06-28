import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import phin from "phin";

export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "dog", {
      description: "Recieve an image of a Dog!!",
      category: "Animals",
      guildOnly: true,
    });
  }
  async run(message, args) {
    let { body } = await phin<{ url: string }>({
      url: "https://random.dog/woof.json",
      parse: "json",
    });

    let dogembed = new RichEmbed().setTitle("Doggo").setImage(body.url);

    message.channel.createMessage({ embed: dogembed });
  }
}
