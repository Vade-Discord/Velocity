import Command from "../../Interfaces/Command";
import { DiscordBlue } from 'discord-image-generation';

export default class DiscordBlueCommand extends Command {
    constructor(client) {
        super(client, 'discordblue', {
            description: "Apply a DiscordBlue effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new DiscordBlue().getImage(avatar);
        message.reply({}, { file: image, name: `discordblue.png`});

    }

}
