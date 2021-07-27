import Command from "../../Interfaces/Command";
import { Bobross } from 'discord-image-generation';

export default class BobrossCommand extends Command {
    constructor(client) {
        super(client, 'bobross', {
            description: "Apply a Bobross effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Bobross().getImage(avatar);
        message.reply({}, { file: image, name: `bobross.png`});

    }

}
