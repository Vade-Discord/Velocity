import Command from "../../Interfaces/Command";
import { DoubleStonk } from 'discord-image-generation';

export default class ConfusedStonkCommand extends Command {
    constructor(client) {
        super(client, 'doublestonk', {
            description: "Apply a DoubleStonk effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const member2 = message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const avatar2 = member2?.user.dynamicAvatarURL(`png`, 512);
        const image = await new DoubleStonk().getImage(avatar, avatar2);
        message.reply({}, { file: image, name: `doublestonk.png`});

    }

}
