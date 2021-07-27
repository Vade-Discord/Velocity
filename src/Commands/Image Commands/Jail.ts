import Command from "../../Interfaces/Command";
import { Jail } from 'discord-image-generation';

export default class JailCommand extends Command {
    constructor(client) {
        super(client, 'jail', {
            description: "Apply a Jail effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Jail().getImage(avatar);
        message.reply({}, { file: image, name: `jail.png`});

    }

}
