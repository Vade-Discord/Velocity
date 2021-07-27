import Command from "../../Interfaces/Command";
import { Mms } from 'discord-image-generation';

export default class MmsCommand extends Command {
    constructor(client) {
        super(client, 'mms', {
            description: "Apply a Mms effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Mms().getImage(avatar);
        message.reply({}, { file: image, name: `Mms.png`});

    }

}
