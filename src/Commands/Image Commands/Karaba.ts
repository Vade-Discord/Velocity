import Command from "../../Interfaces/Command";
import { Karaba } from 'discord-image-generation';

export default class KarabaCommand extends Command {
    constructor(client) {
        super(client, 'karaba', {
            description: "Apply a Karaba effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Karaba().getImage(avatar);
        message.reply({}, { file: image, name: `karaba.png`});

    }

}