import Command from "../../Interfaces/Command";
import {RichEmbed} from "eris";

export default class UnbanCommand extends Command {
    constructor(client) {
        super(client, 'unban', {
            aliases: ["removeban"],
            description: "Remove member(s) bans.",
            category: "Moderation",
            userPerms: ['banMembers'],
            botPerms: ['banMembers']
        });
    }
    async run(message, args) {
    if(!args.length || isNaN(parseInt(args[0]))) return message.channel.createMessage({ content: "You need to specify a members ID.", messageReferenceID: message.id});
    const locate_bans = await message.channel.guild.getBans();
    if(!locate_bans) return message.channel.createMessage({content: "This Guild has no banned members.", messageReferenceID: message.id});

    const error: string[] = [];
    const success: string[] = [];
    for (const arg of args) {
    try {
       await message.channel.guild.getBan(arg);
        success.push(arg);
    } catch (e) {
        error.push(arg);
    }

}

        let embed = new RichEmbed()
        .setTitle(`Result`)
        .setDescription(`**__Success__**\n\n${success.length ? success.join("\n") : 'Invalid ban IDs provided.'}\n\n **__Errors__**\n\n${error.length ? error.join("\n") : 'No invalid ban IDs provided. Good job!'}`)
        .setColor('#83fc9c')
        .setFooter(`Vade Moderation`, this.client.user.avatarURL)
        .setTimestamp()

        message.channel.createMessage({embed: embed});

     }

    }
