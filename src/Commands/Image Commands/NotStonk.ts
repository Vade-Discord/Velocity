import Command from "../../Interfaces/Command";
import { NotStonk } from 'discord-image-generation';

export default class NotStonkCommand extends Command {
    constructor(client) {
        super(client, 'notstonk', {
            description: "Apply a NotStonk effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new NotStonk().getImage(avatar);
        message.reply({}, { file: image, name: `NotStonk.png`});

    }

}
