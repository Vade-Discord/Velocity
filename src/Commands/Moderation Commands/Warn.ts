import Command from "../../Interfaces/Command";
import warningSchema from '../../Schemas/Main Guilds/GuildWarnings';

export default class WarnCommand extends Command {
    constructor(client) {
        super(client, 'warn', {
            aliases: ["givewarn"],
            description: "Warn someone in the current server!",
            category: "Moderation",
            modCommand: true,
            userPerms: ['manageMessages'],
        });
    }
    async run(message, args) {
        if(!args.length) return message.channel.createMessage({ content: `You need to specify who you would like to warn.`, messageReference: { messageID: message.id }});
        const member = await this.client.utils.getMember(message, args[0]);
        if(!member) return;

        const checkHierarcy = this.client.utils.hasHierarchy(message.channel.guild, message.member, member);
        if(!checkHierarcy) return message.channel.createMessage({ content: `You may only warn someone with a lower role than yourself.`, messageReference: { messageID: message.id }});



     }

    }
