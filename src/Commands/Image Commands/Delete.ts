import Command from "../../Interfaces/Command";
import { Delete } from 'discord-image-generation';

export default class DeleteCommand extends Command {
    constructor(client) {
        super(client, 'delete', {
            description: "Apply a Delete effect to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Delete().getImage(avatar);
        message.reply({}, { file: image, name: `delete.png`});

    }

}
