import Command from "../../Interfaces/Command";
import { Kiss } from 'discord-image-generation';

export default class KissCommand extends Command {
    constructor(client) {
        super(client, 'kiss', {
            description: "Apply a Kiss effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const member2 = message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const avatar2 = member2?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Kiss().getImage(avatar, avatar2);
        message.reply({}, { file: image, name: `kiss.png`});

    }

}