import Command from "../../Interfaces/Command";
import { Triggered } from 'discord-image-generation';

export default class TriggeredCommand extends Command {
    constructor(client) {
        super(client, 'triggered', {
            aliases: ["Trigger"],
            description: "Apply a Triggered effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Triggered().getImage(avatar);
        message.reply({}, { file: image, name: `triggered.png`});

    }

}
