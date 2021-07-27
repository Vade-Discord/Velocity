import Command from "../../Interfaces/Command";
import { Poutine } from 'discord-image-generation';

export default class PoutineCommand extends Command {
    constructor(client) {
        super(client, 'poutine', {
            description: "Apply a Poutine effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Poutine().getImage(avatar);
        message.reply({}, { file: image, name: `Poutine.png`});

    }

}
