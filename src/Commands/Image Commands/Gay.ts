import Command from "../../Interfaces/Command";
import { Gay } from 'discord-image-generation';

export default class GayCommand extends Command {
    constructor(client) {
        super(client, 'gay', {
            aliases: ["gayify"],
            description: "Apply a gay filter to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Gay().getImage(avatar);
        message.channel.createMessage({}, { file: image, name: `gay.png`});

    }

}
