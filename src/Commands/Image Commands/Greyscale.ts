import Command from "../../Interfaces/Command";
import { Greyscale } from 'discord-image-generation';

export default class GreyscaleCommand extends Command {
    constructor(client) {
        super(client, 'greyscale', {
            aliases: ["gscale"],
            description: "Apply a greyscale filter to a users avatar.",
            category: "Images",
        });
    }
    async run(message, args) {

        const foundmember = await this.client.utils.getMember(message, args[0], false);
        const member = foundmember ? foundmember : message.member;
        const avatar = member?.user.dynamicAvatarURL(`png`, 512);
        const image = await new Greyscale().getImage(avatar);
        message.reply({}, { file: image, name: `greyscale.png`});

     }

    }
