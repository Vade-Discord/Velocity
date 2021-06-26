import Command from "../../Interfaces/Command";
import ms from 'ms';
import humanize from 'humanize-duration';
import keyStorage from '../../Schemas/Premium Schemas/KeyStorage';
import { Types } from 'mongoose';

export default class GenerateCommand extends Command {
    constructor(client) {
        super(client, 'generatekey', {
            aliases: ["keygen", "genkey"],
            description: "Generate a premium key.",
            category: "Development",
            devOnly: true
        });
    }
    async run(message, args) {

        const length = args[0];
        if(!length) return message.channel.createMessage({ content: `You need to provide an expiration time.`, messageRefernece: { messageID: message.id }});
        if(ms(length) > ms('360d')) {
            return message.channel.createMessage({ content: `The key shouldn't last longer than one year.`, messageRefernece: { messageID: message.id }});

        }

        const key = this.client.utils.generateKey();
        const newSchema = new keyStorage({
        _id: Types.ObjectId(),
        key,
        expirationTime: Date.now() + ms(length),
        length: ms(length),
        createdBy: message.author.id,
        createdOn: Date.now(),
    });

    await newSchema.save();

        message.channel.createMessage({ content: `Here is the generated key with an expiration time of \`${humanize(ms(length))}\`\n\n\`${key}\``, messageRefernece: { messageID: message.id }});


     }

    }
