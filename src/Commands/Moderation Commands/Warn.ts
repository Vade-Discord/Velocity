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
            guildOnly: true,
        });
    }
    async run(message, args) {
        if(!args.length) return message.channel.createMessage({ content: `You need to specify who you would like to warn.`, messageReference: { messageID: message.id }});
        const member = await this.client.utils.getMember(message, args[0]);
        if(!member) return;

        const checkHierarcy = this.client.utils.hasHierarchy(message.channel.guild, message.member, member);
        if(!checkHierarcy) return message.channel.createMessage({ content: `You may only warn someone with a lower role than yourself.`, messageReference: { messageID: message.id }});
        const reason = args.slice(1).join(" ")?.length ? args.slice(1).join(" ") : 'No reason provided.';
        const userWarnings = await warningSchema.findOne({ user: member.id, guild: message.channel.guild.id });
        let total = 0;
        if(userWarnings) {
            total = userWarnings.total;
        }

        const id = this.client.utils.caseID();

        const warningEmbed = new this.client.embed()
            .setAuthor(`User Warned!`, message.author.avatarURL)
            .setDescription(`You have successfully warned ${member.mention}, they were warned with the reason:\n"${reason}"\n\nThey now have **${total + 1}** warnings.`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(`Vade Moderation - Case ID: ${id}`, this.client.user.avatarURL);

            userWarnings ? await userWarnings.updateOne({
                $inc: { total: 1},
                $push: { reasons: reason },
                mostRecent: Date.now(),

            }) : await new warningSchema({
                guild: message.channel.guild.id,
                user: member.id,
                total: 1,
                id: id,
                mostRecent: Date.now(),
                reasons: [reason]
            }).save();

        message.channel.createMessage({ embed: warningEmbed, messageReference: { messageID: message.id }});

        const modLog = await this.client.utils.loggingChannel(message.channel.guild, 'moderation');
        if(!modLog) return;

        const logEmbed = new this.client.embed()
            .setAuthor(`Case ${id} | Warning | ${member.username}#${member.discriminator}`)
            .setDescription(`User: **${member.username}#${member.discriminator}**\nModerator: ${message.author.mention}\nReason: "**${reason}**"`)
            .setColor("YELLOW")
            .setTimestamp()
            .setFooter(`Vade Moderation | Case ID: ${id}`, this.client.user.avatarURL)
            .setThumbnail(this.client.user.avatarURL);

        modLog.createMessage({ embed: logEmbed });
     }

    }
