import Command from "../../Interfaces/Command";
import { Beautiful } from 'discord-image-generation';

export default class BeautifulCommand extends Command {
    constructor(client) {
        super(client, 'beautiful', {
            description: "Apply a Batslap effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Beautiful().getImage(avatar);
        message.reply({}, { file: image, name: `beautiful.png`});

    }

}
