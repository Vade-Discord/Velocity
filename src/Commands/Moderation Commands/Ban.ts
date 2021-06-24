import Command from "../../Interfaces/Command";

export default class BanCommand extends Command {
    constructor(client) {
        super(client, 'ban', {
            aliases: ["addban", 'guildban'],
            description: "Ban a member from the server.",
            category: "Moderation",
            modCommand: true,
            userPerms: ['banMembers'],
            botPerms: ['banMembers'],
            guildOnly: true,
        });
    }
    async run(message, args) {


        let members: Array<Object> = message.mentions;
        if(!members.length) {
            members = args;
            if(!members.length) return message.channel.createMessage({content: `You need to either mention the users or their ID.`, messageReferenceID: message.id });
        }

        message.channel.createMessage(`Member validation check successful`);
        if(message.mentions.length) {
            for(const mention of message.mentions) {
                args.shift()
                message.channel.createMessage(`Mention detected: ${mention}`)
            }
            message.channel.createMessage(`Args now: ${args}`)
        } else {
            for(const arg of args) {
                if(isNaN(parseInt(arg))) {
                    const member = await message.channel.guild.searchMembers(arg, 1);
                    if(!member.length) return message.channel.createMessage({content: `Unable to locate the member: "${arg}"`, messageReferenceID: message.id });
                    member[0].ban(7);
                    message.channel.createMessage({content: `Successfully banned: ${member[0].user.username}#${member[0].user.discriminator}`, messageReferenceID: message.id });
                } else {
                    const member = message.channel.guild.members.get(arg);
                    if(!member) return message.channel.createMessage({content: `Unable to locate the member: "${arg}"`, messageReferenceID: message.id });
                    message.channel.createMessage({content: `Somehow found a member: ${member.user.username}#${member.user.discriminator}`, messageReferenceID: message.id });
                }
            }
        }

     }

    }
