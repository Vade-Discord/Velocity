import Command from "../../Interfaces/Command";
import { Invert } from 'discord-image-generation';

export default class InvertCommand extends Command {
    constructor(client) {
        super(client, 'invert', {
            description: "Apply an inverted effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Invert().getImage(avatar);
        message.reply({}, { file: image, name: `inverted.png`});

    }

}
