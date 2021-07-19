import Command from "../../Interfaces/Command";
import phin from "phin";

export default class RedpandaCommand extends Command {
    constructor(client) {
        super(client, "redpanda", {
            description: "Recieve an image of a Redpanda!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ image: string }>({
            url: "https://some-random-api.ml/animal/red_panda",
            parse: "json",
        });

        let embed = new this.client.embed().setImage(body.image).setDescription(`[Click To View](${body.image})`);

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id } });
    }
}