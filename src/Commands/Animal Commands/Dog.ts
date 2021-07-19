import Command from "../../Interfaces/Command";
import phin from "phin";

export default class DogCommand extends Command {
  constructor(client) {
    super(client, "dog", {
      description: "Recieve an image of a Dog!",
      category: "Animals",
      aliases: ['doggo', 'cutedog', 'doggo'],
      guildOnly: true,
    });
  }
  async run(message, args) {
    let { body } = await phin<{ url: string }>({
      url: "https://random.dog/woof.json",
      parse: "json",
    });

    let embed = new this.client.embed().setImage(body.url).setDescription(`[Click To View](${body.url})`);

    message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});
  }
}
