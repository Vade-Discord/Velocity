import Command from "../../Interfaces/Command";
import phin from "phin";

export default class WhaleCommand extends Command {
    constructor(client) {
        super(client, "whale", {
            description: "Recieve an image of a Whale!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ link: string }>({
            url: "https://some-random-api.ml/img/whale",
            parse: "json",
        });

        let embed = new this.client.embed().setImage(body.link).setDescription(`[Click To View](${body.link})`);

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id } });
    }
}