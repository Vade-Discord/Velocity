import Command from "../../Interfaces/Command";

export default class AntiraidCommand extends Command {
    constructor(client) {
        super(client, 'antiraid', {
            description: "Enable/Disable the anti raid feature. (Kicks all new members whilst active)",
            category: "Moderation",
            userPerms: ['manageGuild'],
            botPerms: ['kickMembers']
        });
    }
    async run(interaction, member, options, subOptions) {

        const active = (await this.client.redis.get(`antiraid.${interaction.guildID}`));
        if(active) {
            await this.client.redis.del(`antiraid.${interaction.guildID}`);
            interaction.createFollowup(`Successfully **deactivated** the anti-raid system for this server.`);
        } else {
            await this.client.redis.set(`antiraid.${interaction.guildID}`, true, 'EX', 3600);
            interaction.createFollowup(`Successfully **enabled** the anti-raid system for this server. Please bear in mind that this will **kick** all new members from the server whilst active. This wil automatically be deactivated after **1 hour**.`);
        }


    }

    }