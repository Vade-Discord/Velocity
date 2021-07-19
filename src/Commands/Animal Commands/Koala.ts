import Command from "../../Interfaces/Command";
import phin from "phin";

export default class KoalaCommand extends Command {
    constructor(client) {
        super(client, "koala", {
            description: "Recieve an image of a Koala!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ link: string }>({
            url: "https://some-random-api.ml/img/koala",
            parse: "json",
        });

        let embed = new this.client.embed().setImage(body.link).setDescription(`[Click To View](${body.link})`);

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id } });
    }
}