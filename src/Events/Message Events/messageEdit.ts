import { Event } from '../../Interfaces/Event';


export default class MessageEditEvent extends Event {
    constructor(client) {
        super(client, "messageUpdate", {

        });
    }

    async run(newMessage, oldMessage) {



        if(!newMessage.editedTimestamp) {
            return;
        }
        const guild = (await this.client.getRESTGuild(newMessage.guildID));
        const member = newMessage.member;
        if(guild.id === this.client.config.GUILDS.testing) {
            const newContent = oldMessage?.content !== newMessage?.content ? newMessage?.content ?? "No Content" : oldMessage?.content;
            if(newContent === oldMessage?.content) {
                return;
            }
            console.log(newContent);
            let tag = `${member.user.username}#${member.user.discriminator}`
            let embed = new this.client.embed()
                .setAuthor(tag, member.user.avatarURL)
                .setTitle(`📥 Message Edited`)
                .setDescription(`**Channel**: ${newMessage.channel.mention}\n\n **Member:** ${member.mention} (${member.id})\n\n**Old Message:** ${oldMessage?.content}\n\n**New Message:** ${newContent}`)
                .setFooter(`Velocity Logging System`)
                .setColor(`#00C09A`)
                .setTimestamp();

            const logChannel = (await this.client.utils.loggingChannel(guild, "message"));
            logChannel?.createMessage({ embeds: [embed] });
        }

    }

}
