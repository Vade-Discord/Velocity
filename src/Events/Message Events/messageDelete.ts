import { Event } from '../../Interfaces/Event';


export default class MessageDeleteEvent extends Event {
    constructor(client) {
        super(client, "messageDelete", {

        });
    }

    async run(message) {


        const { content } = message;
        const guild = (await this.client.getRESTGuild(message.guildID))!!;
        const member = (await guild.getRESTMember(message.author.id));




        let tag = `${member.user.username}#${member.user.discriminator}`
        let embed = new this.client.embed()
            .setAuthor(tag, member.user.avatarURL)
            .setTitle(`📥 Message Deleted`)
            .setDescription(`**Channel**: ${message.channel.mention}\n\n **Member:** ${member.mention} (${member.id})\n\n**Message:** ${!message.content?.length ? "No Content" : message.content}`)
            .setFooter(`Velocity Logging System`)
            .setColor(`#F00000`)
            .setTimestamp();


        message.attachments.length ? embed.setImage(message.attachments[0].url) : null;
        const logChannel = (await this.client.utils.loggingChannel(guild, "message", message?.channel.id));
        logChannel?.createMessage({ embeds: [embed] });

    }

}
