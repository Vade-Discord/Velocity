import Command from "../../Interfaces/Command";
import { Blink } from 'discord-image-generation';

export default class BlinkCommand extends Command {
    constructor(client) {
        super(client, 'blink', {
            description: "Have multiple users avatars mixed together into one gif.",
            category: "Images",
        });
    }
    async run(message, args) {

        const avatars = [];

       for(const arg of args) {
           const foundmember = await this.client.utils.getMember(message, args[0], false);
           const member = foundmember ? foundmember : message.member;
           const avatar = member?.user.dynamicAvatarURL(`png`, 512);
           avatars.push(avatar);
       }

       const avatar = message.author.dynamicAvatarURL('png', 512);
        const image = await new Blink().getImage(avatar, avatars.join(","));
        message.channel.createMessage({}, { file: image, name: `blink.gif`});

    }

}
