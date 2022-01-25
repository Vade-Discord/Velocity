import { Event } from '../../Interfaces/Event';
import {NewsChannel, TextChannel} from "eris";


export default class PlayerCreateEvent extends Event {
    constructor(client) {
        super(client, "playerCreate", {
            emitter: "manager",
        });
    }

    async run(player) {

        const guild = (await this.client.getRESTGuild(player.guild));
        if(!guild) {
            return;
        }
        const logChannelID = this.client.config.PRIVATE.music_log;
        const logChannel = (await this.client.getRESTChannel(logChannelID))
        if(!logChannel) {
            return;
        }
        const logEmbed = new this.client.embed()
            .setTitle("Player Created")
            .setDescription(`**Server:** ${guild.name} (${guild.id})\n`)
            .setColor(this.client.constants.colours.green)
            .setFooter(`Velocity | Music Logging`)
            .setTimestamp()

        if (logChannel instanceof NewsChannel || logChannel instanceof TextChannel) {
            logChannel.createMessage({embeds: [logEmbed]});
        }
    }

}
