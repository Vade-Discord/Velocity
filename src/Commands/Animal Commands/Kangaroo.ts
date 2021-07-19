import Command from "../../Interfaces/Command";
import phin from "phin";

export default class KangarooCommand extends Command {
    constructor(client) {
        super(client, "kangaroo", {
            description: "Recieve an image of a Kangaroo!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ image: string }>({
            url: "https://some-random-api.ml/animal/kangaroo",
            parse: "json",
        });

        let embed = new this.client.embed().setImage(body.image).setDescription(`[Click To View](${body.image})`);

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id } });
    }
}