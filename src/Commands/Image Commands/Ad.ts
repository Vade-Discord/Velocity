import Command from "../../Interfaces/Command";
import { Ad } from 'discord-image-generation';

export default class AdCommand extends Command {
    constructor(client) {
        super(client, 'ad', {
            description: "Apply an Ad effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Ad().getImage(avatar);
        message.reply({}, { file: image, name: `ad.png`});

    }

}

