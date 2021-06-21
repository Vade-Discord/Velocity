import Command from "../../Interfaces/Command";

export default class KickCommand extends Command {
    constructor(client) {
        super(client, 'kick', {
            aliases: ["kickmember"],
            description: "boot",
            category: "Moderation",
            modCommand: true,
            userPerms: ['kickMembers']
        });
    }
    async run(message, args) {


        if(!args.length) return message.channel.createMessage({ content: `You need to provide a member.`, messageReference: { messageID: message.id }})
        const member = await this.client.utils.getMember(message, args[0]);
        if(!member || Array.isArray(member) ? !member.length : false) return;
        message.channel.createMessage({ content: `Located ${member.username}#${member.discriminator}`})


     }

    }
