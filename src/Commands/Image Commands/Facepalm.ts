import Command from "../../Interfaces/Command";
import { Facepalm } from 'discord-image-generation';

export default class FacepalmCommand extends Command {
    constructor(client) {
        super(client, 'facepalm', {
            description: "Apply a Facepalm effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Facepalm().getImage(avatar);
        message.reply({}, { file: image, name: `facepalm.png`});

    }

}
