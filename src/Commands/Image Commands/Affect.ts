import Command from "../../Interfaces/Command";
import { Affect } from 'discord-image-generation';

export default class AffectCommand extends Command {
    constructor(client) {
        super(client, 'affect', {
            description: "Apply an Affect effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Affect().getImage(avatar);
        message.reply({}, { file: image, name: `affect.png`});

    }

}
