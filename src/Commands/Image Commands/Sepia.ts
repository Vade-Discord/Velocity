import Command from "../../Interfaces/Command";
import { Sepia } from 'discord-image-generation';

export default class SepiaCommand extends Command {
    constructor(client) {
        super(client, 'sepia', {
            description: "Apply a sepia effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Sepia().getImage(avatar);
        message.channel.createMessage({}, { file: image, name: `sepia.png`});

    }

}
