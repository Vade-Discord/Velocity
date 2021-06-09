import Command from "../../Interfaces/Command";
import fetch from 'node-fetch'

export default class AvatarCommand extends Command {
    constructor(client) {
        super(client, 'avatar', {
            aliases: ["av"],
            description: "View either your own or another users avatar!",
            category: "Fun",
        });
    }
    async run(message, args) {
    if(!args.length) return message.channel.createMessage({ content: `You need to specify a member.`, messageReference: { messageID: message.id }});
  const member = await this.client.utils.getMember(message, args[0]);
    console.log(member)
    const embed = new this.client.embed()
        .setTitle(`${member[0].username}#${member[0].user.discriminator}'s Avatar`)
        .setImage(member[0].user.avatarURL)
        .setColor('#fafafa')
        .setTimestamp()
        .setFooter(`Vade`, this.client.user.avatarURL)

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});

     }

    }
