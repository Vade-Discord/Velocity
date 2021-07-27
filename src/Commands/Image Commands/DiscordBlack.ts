import Command from "../../Interfaces/Command";
import { DiscordBlack } from 'discord-image-generation';

export default class DiscordBlackCommand extends Command {
    constructor(client) {
        super(client, 'discordblack', {
            description: "Apply a DiscordBlack effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new DiscordBlack().getImage(avatar);
        message.reply({}, { file: image, name: `discordblack.png`});

    }

}
