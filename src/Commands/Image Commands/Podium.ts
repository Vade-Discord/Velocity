import Command from "../../Interfaces/Command";
import {Podium} from 'discord-image-generation';

export default class PodiumCommand extends Command {
    constructor(client) {
        super(client, 'podium', {
            description: "Apply a Podium effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const foundmember1 = await this.client.utils.getMember(message, args[1], false);
        const member = message.member;
        const member1 = foundmember ? foundmember : message.member;
        const member2 = foundmember1 ? foundmember1 : message.member;

        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const avatar1 = member1?.user.dynamicAvatarURL(`png`, 512);
        const avatar2 = member2?.user.dynamicAvatarURL(`png`, 512);

        const image = await new Podium().getImage(avatar, avatar1, avatar2, "First", "Second", "Third");
        message.reply({}, { file: image, name: `Podium.png`});

    }

}
