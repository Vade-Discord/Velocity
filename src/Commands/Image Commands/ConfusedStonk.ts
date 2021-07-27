import Command from "../../Interfaces/Command";
import { ConfusedStonk } from 'discord-image-generation';

export default class ConfusedStonkCommand extends Command {
    constructor(client) {
        super(client, 'confusedstonk', {
            description: "Apply a ConfusedStonk effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new ConfusedStonk().getImage(avatar);
        message.reply({}, { file: image, name: `confusedstonk.png`});

    }

}
