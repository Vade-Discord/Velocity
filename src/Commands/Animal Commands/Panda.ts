import Command from "../../Interfaces/Command";
import phin from "phin";

export default class PandaCommand extends Command {
    constructor(client) {
        super(client, "panda", {
            description: "Recieve an image of a Panda!",
            category: "Animals",
            guildOnly: true,
        });
    }
    async run(message, args) {
        let { body } = await phin<{ link: string }>({
            url: "https://some-random-api.ml/img/panda",
            parse: "json",
        });

        console.log(body)

        let pandaEmbed = new this.client.embed().setImage(body.link).setDescription(`[Click To View](${body.link})`);

        message.channel.createMessage({ embed: pandaEmbed, messageReference: { messageID: message.id } });
    }
}
