import Command from "../../Interfaces/Command";
import phin from "phin";

export default class FoxCommand extends Command {
    constructor(client) {
        super(client, "fox", {
            description: "Recieve an image of a Fox!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ image: string }>({
            url: "https://randomfox.ca/floof/",
            parse: "json",
        });

        let embed = new this.client.embed().setImage(body.image).setDescription(`[Click To View](${body.image})`);

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id } });
    }
}