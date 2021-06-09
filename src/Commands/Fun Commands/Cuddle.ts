import Command from "../../Interfaces/Command";
import { RichEmbed } from 'eris';

export default class CuddleCommand extends Command {
    constructor(client) {
        super(client, 'cuddle', {
            aliases: ["snuggle"],
            description: "",
            category: "",
        });
    }
    async run(message, args) {

        if(!args.length) return message.channel.createMessage({ content: `You need to specify a member.`, messageReference: { messageID: message.id }});
    let member = await this.client.utils.getMember(message, args[0]);
    if(!member) return;
        let cuddle = new this.client.embed()
            .setImage("https://i.imgur.com/0yAIWbg.gif")
        await message.channel.createMessage({ content: `${member[0].mention} you got a cuddle from ${message.author.username}#${message.author.discriminator}`, embed: cuddle });


     }

    }
