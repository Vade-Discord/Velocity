import { Event } from '../../Interfaces/Event';
import guildSchema from '../../Schemas/Main-Guilds/GuildSchema';
import inviteMemberSchema from "../../Schemas/Invite Schemas/inviteMember";
import inviterSchema from "../../Schemas/Invite Schemas/inviter";

import autoRoles from '../../Schemas/Main-Guilds/GuildAutoRoles';
import {Invite, TextChannel} from "eris";
import Collection from "@discordjs/collection";

export default class GuildMemberAddEvent extends Event {
    constructor(client) {
        super(client, "guildMemberAdd", {

        });
    }

    async run(guild, member) {

        const me = await guild.getRESTMember(this.client.user.id);
        const guildData = (await this.client.utils.getGuildSchema(guild))!!;

        const guildAutoRoleData = (await autoRoles.findOne({guildID: guild.id}));

        if(me.permissions.has("manageRoles") && guildAutoRoleData && guildAutoRoleData?.enabled && guildAutoRoleData.roles?.length) {
          await member.edit({
                roles: guildAutoRoleData?.roles
            });
        }
        const welcomeChannel = await this.client.utils.loggingChannel(guild, 'welcome');
        const inviteChannel = await this.client.utils.loggingChannel(guild, 'invites');
        if (inviteChannel) {

            const invites = (await guild.getInvites());
            const gi = await this.client.redis.get(`invites.${member.guild.id}`)
                // NEW
            console.log(gi)
            const invite: Invite =
                invites.find((x) => gi?.find((e) => e.code === x.code).uses < x.uses && gi?.includes(x.code)) ||
                gi?.find((x) => !invites.find((e) => e.code === x.code)) ||
                guild.vanityURL;
            console.log(invite)

            if(!invite) {
                inviteChannel.createMessage(`${member.mention} joined! Unable to locate who they were invited by.`);
            } else {
                if(invite === guild.vanityURL) {
                    inviteChannel.createMessage(`${member.mention} joined via Vanity URL!`);
                } else {
                    if(invite.inviter) {
                        await inviteMemberSchema.findOneAndUpdate(
                            { guildID: guild.id, userID: member.id },
                            { $set: { inviter: invite.inviter.id, date: Date.now() } },
                            { upsert: true }
                        );
                        if (
                            Date.now() - member.user.createdAt <=
                            1000 * 60 * 60 * 24 * 7
                        ) {
                            await inviterSchema.findOneAndUpdate(
                                { guildID: guild.id, userID: invite.inviter.id },
                                { $inc: { total: 1, fake: 1 } },
                                { upsert: true }
                            );
                            const inviterData = await inviterSchema.findOne({
                                guildID: guild.id,
                                userID: invite.inviter.id,
                            });
                            const total = inviterData ? inviterData?.total : 0;
                            inviteChannel.createMessage(
                                `${member.mention} joined our server. Was invited by ${invite.inviter.username}#${invite.inviter.discriminator} (**${total}** Invites)`
                            );
                        } else {
                            await inviterSchema.findOneAndUpdate(
                                {guildID: guild.id, userID: invite.inviter.id},
                                {$inc: {total: 1, regular: 1}},
                                {upsert: true}
                            );
                            const inviterData = await inviterSchema.findOne({
                                guildID: guild.id,
                                userID: invite.inviter.id,
                            });
                            const total = inviterData ? inviterData.total : 0;
                            inviteChannel.createMessage(
                                `${member.mention} joined our server. They were invited by ${invite.inviter.username}#${invite.inviter.discriminator} (**${total}** Invites)`
                            );
                        }
                    }
                }
            }


        }
        if (welcomeChannel) {
            if(welcomeChannel instanceof TextChannel && welcomeChannel.permissionsOf(this.client.user.id).has("sendMessages")) {
              return  welcomeChannel.createMessage(guildData && guildData?.welcomeMessage ? `${member.mention}, ${guildData?.welcomeMessage}` : `${member.mention} has joined the server.`)
            }
        }


    }

}