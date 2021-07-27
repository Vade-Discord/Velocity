import Command from "../../Interfaces/Command";
import { Bed } from 'discord-image-generation';

export default class MonsterCommand extends Command {
    constructor(client) {
        super(client, 'monster', {
            aliases: ["bed"],
            description: "Funny bed meme.",
            category: "Images",
        });
    }
    async run(message, args) {

        const member = await this.client.utils.getMember(message, args[0]);
        if(!member) return;

        const image = await new Bed().getImage(message.author.dynamicAvatarURL('png', 512), member.user.dynamicAvatarURL('png', 512));
        message.reply({}, { file: image, name: `bed.png`});

    }

}
