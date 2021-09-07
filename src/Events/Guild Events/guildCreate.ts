import { Event } from '../../Interfaces/Event';
import { TextChannel } from "eris";


export default class guildCreateEvent extends Event {
    constructor(client) {
        super(client, "guildCreate", {

        });
    }

    async run(guild) {

        console.log(`Running the event.`)

        const mainGuild = (await this.client.getRESTGuild(this.client.config.GUILDS.main));
        const guildOwner = (await this.client.getRESTUser(guild.ownerID))!!;
        if(mainGuild) {

                const embed = new this.client.embed()
                    .setTitle(`Added to a Server!`)
                    .addField(`Guild`, `Guild Name: ${guild.name} (${guild.id})`)
                    .addField(`Owner Info`, `Owner: ${guildOwner.username}#${guildOwner.discriminator} (${guild.ownerID})`)
                    .addField(`Member Info`, `${guild.memberCount} Members!`)
                    .setColor(this.client.constants.colours.green)
                    .setTimestamp();

                const channel = (await this.client.getRESTChannel(this.client.config.PRIVATE.guild_logs));
            if (channel && channel instanceof TextChannel) {
                // @ts-ignore
                channel.createMessage({embeds: [embed]})
            }


        }


    }

}