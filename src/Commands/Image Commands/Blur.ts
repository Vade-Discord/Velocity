import Command from "../../Interfaces/Command";
import { Blur } from 'discord-image-generation';

export default class BlurCommand extends Command {
    constructor(client) {
        super(client, 'blur', {
            aliases: ["bfilter"],
            description: "Apply a blur effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Blur().getImage(avatar);
        message.channel.createMessage({}, { file: image, name: `blur.png`});

    }

}
