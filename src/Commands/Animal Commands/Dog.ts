import Command from "../../Interfaces/Command";
import phin from "phin";

export default class DogCommand extends Command {
  constructor(client) {
    super(client, "dog", {
      description: "Recieve an image of a Dog!",
      category: "Animals",
      aliases: ['doggo', 'cutedog'],
      guildOnly: true,
    });
  }
  async run(message, args) {
    let { body } = await phin<{ url: string }>({
      url: "https://random.dog/woof.json",
      parse: "json",
    });

    let dogEmbed = new this.client.embed().setImage(body.url).setDescription(`[Click To View](${body.url})`);

    message.channel.createMessage({ embed: dogEmbed, messageReference: { messageID: message.id }});
  }
}
