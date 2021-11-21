import { Event } from '../../Interfaces/Event';
import {ThreadChannel} from "eris";


export default class threadCreateEvent extends Event {
    constructor(client) {
        super(client, "threadCreate", {

        });
    }

    async run(thread) {

        if(!thread?.ownerID) {
            return;
        }

        const member = (await this.client.getRESTUser(thread.ownerID))!!;
    console.log("Thread created by: ", thread)

        const tag = `${member.username}#${member.discriminator}`

        let embed = new this.client.embed()
            .setAuthor(tag, member.avatarURL)
            .setTitle(`${this.client.constants.emojis.threadChannel.mention} Thread Created`)
            .setDescription(`**Channel:** ${thread.mention}`)
            .setThumbnail(member.avatarURL)
            .setFooter(`Velocity Logging System`)
            .setColor(`#00C09A`)
            .setTimestamp();

    const logChannel = (await this.client.utils.loggingChannel(thread.guild, 'threads'));
    logChannel ? logChannel.createMessage({ embeds: [embed ]}).catch(() => null) : null;

    }

}