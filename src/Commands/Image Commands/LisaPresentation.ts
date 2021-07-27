import Command from "../../Interfaces/Command";
import { LisaPresentation } from 'discord-image-generation';

export default class LisaPresentationFacepalmCommand extends Command {
    constructor(client) {
        super(client, 'lisapresentation', {
            description: "Apply a LisaPresentation effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new LisaPresentation().getImage(avatar);
        message.reply({}, { file: image, name: `LisaPresentation.png`});

    }

}
