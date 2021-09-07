import { Event } from '../../Interfaces/Event';
import guildSchema from '../../Schemas/Main-Guilds/GuildSchema';
import autoRoles from '../../Schemas/Main-Guilds/GuildAutoRoles';
import {TextChannel} from "eris";

export default class BanAddEvent extends Event {
    constructor(client) {
        super(client, "guildMemberAdd", {

        });
    }

    async run(guild, member) {

        const me = await guild.getRESTMember(this.client.user.id);
        const guildData = await guildSchema.findOne({ guildID: guild.id });

        const guildAutoRoleData = (await autoRoles.findOne({guildID: guild.id}));

        if(me.permissions.has("manageRoles") && guildAutoRoleData && guildAutoRoleData?.enabled && guildAutoRoleData.roles?.length) {
          await member.edit({
                roles: guildAutoRoleData?.roles
            });
        }
        const welcomeChannel = await this.client.utils.loggingChannel(guild, 'welcome');
        const inviteChannel = await this.client.utils.loggingChannel(guild, 'invites');
        if (welcomeChannel) {
            if(welcomeChannel instanceof TextChannel && welcomeChannel.permissionsOf(this.client.user.id).has("sendMessages")) {
                welcomeChannel.createMessage(guildData && guildData?.welcomeMessage ? `${member.mention}, ${guildData?.welcomeMessage}` : `${member.mention} has joined the server.`)
            }
        }
        if (inviteChannel) {

        }


    }

}