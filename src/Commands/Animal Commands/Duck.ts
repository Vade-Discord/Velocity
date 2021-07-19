import Command from "../../Interfaces/Command";
import phin from "phin";

export default class DuckCommand extends Command {
    constructor(client) {
        super(client, "duck", {
            description: "Recieve an image of a Duck!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ url: string }>({
            url: "https://random-d.uk/api/v1/random?type=gif,png",
            parse: "json",
        });

        let embed = new this.client.embed().setImage(body.url).setDescription(`[Click To View](${body.url})`);

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id } });
    }
}
