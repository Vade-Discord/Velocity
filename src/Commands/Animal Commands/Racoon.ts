import Command from "../../Interfaces/Command";
import phin from "phin";

export default class RacoonCommand extends Command {
    constructor(client) {
        super(client, "racoon", {
            description: "Recieve an image of a Racoon!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ link: string }>({
            url: "https://some-random-api.ml/img/racoon",
            parse: "json",
        });

        let embed = new this.client.embed().setImage(body.link).setDescription(`[Click To View](${body.link})`);

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id } });
    }
}