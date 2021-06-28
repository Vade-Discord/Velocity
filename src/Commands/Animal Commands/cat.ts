import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import fetch from "node-fetch";

export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "cat", {
      description: "Recieve an image of a Cat!!",
      category: "Animals",
      guildOnly: true,
    });
  }
  async run(message, args) {
    try {
      const catData = await fetch(
        "https://api.thecatapi.com/v1/images/search"
      ).then((response) => response.json());
      const catImage = catData[0].url;

      const embed = new RichEmbed().setImage(catImage);

      message.channel.createMessage({ embed: embed });
    } catch (err) {
      console.log(err);
      return message.channel.send(
        `Looks as if an error has occured. Try again later.`
      );
    }
  }
}
