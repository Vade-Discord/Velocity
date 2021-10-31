import { Event } from '../../Interfaces/Event';
import { TextChannel } from "eris";


export default class guildCreateEvent extends Event {
    constructor(client) {
        super(client, "guildCreate", {

        });
    }

    async run(guild) {

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
                channel.createMessage({embeds: [embed]}).catch(() => null);
            }

            const systemChannel = guild.channels.some((channel) => channel.type === 0 && channel.permissionsOf(this.client.user.id).has("sendMessages"));
            console.log(systemChannel)
            if(systemChannel) {
                const newlyAdded = new this.client.embed()
                    .setTitle(`Thanks for adding me to your Server!`)
                    .setDescription(
                        `Hello! Thank you for adding Velocity to your server! \n\nFor a list of Commands you can run \`/help\`. \nIf you'd like help on a specific command/category, you can do \`/help <Command/Category>\`.`
                    )
                    .addField(`Support Server`, `https://discord.com/invite/DFa5wNFWgP`)
                    .addField(`Lead Developer`, `Ethan#7000 (473858248353513472)`);


                const channelToSend = guild.channels.filter((channel) => channel.type === 0 && channel.permissionsOf(this.client.user.id).has("sendMessages"));
                systemChannel ? channelToSend[0].createMessage({ embeds: [newlyAdded] }).catch(() => null) : null;
            }

        }


    }

}