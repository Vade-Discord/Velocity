import Command from "../../Interfaces/Command";
import { Hitler } from 'discord-image-generation';

export default class HitlerCommand extends Command {
    constructor(client) {
        super(client, 'hitler', {
            description: "Apply a Hitler effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Hitler().getImage(avatar);
        message.reply({}, { file: image, name: `hitler.png`});

    }

}
