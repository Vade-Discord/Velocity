import Command from "../../Interfaces/Command";
import { Batslap } from 'discord-image-generation';

export default class BatslapCommand extends Command {
    constructor(client) {
        super(client, 'batslap', {
            description: "Apply a Batslap effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const member2 = message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const avatar2 = member2?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Batslap().getImage(avatar2, avatar);
        message.reply({}, { file: image, name: `batslap.png`});

    }

}
