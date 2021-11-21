import { Event } from '../../Interfaces/Event';
import inviteMemberSchema from "../../Schemas/Invite Schemas/inviteMember";
import inviterSchema from "../../Schemas/Invite Schemas/inviter";
import autoRoles from '../../Schemas/Main-Guilds/GuildAutoRoles';

export default class GuildMemberRemoveEvent extends Event {
    constructor(client) {
        super(client, "guildMemberRemove", {

        });
    }

    async run(guild, member) {

        let user = (await this.client.getRESTUser(member.id));
        if(!user) {
            user = member;
        }
        const me = await guild.getRESTMember(this.client.user.id);
        const guildData = (await this.client.utils.getGuildSchema(guild))!!;

        const welcomeChannel = (await this.client.utils.loggingChannel(guild, 'welcome'));
        const inviteChannel = (await this.client.utils.loggingChannel(guild, 'invites'));

        if(inviteChannel) {

            const inviteMemberData = await inviteMemberSchema.findOne({
                guildID: guild.id,
                userID: member.id,
            });
            if (!inviteMemberData) {
                inviteChannel.createMessage(
                    `\`${user.username}#${user.discriminator}\` They left our server but I could not find out who they were invited by.`
                );
            } else {
                const inviter = (await this.client.getRESTUser(inviteMemberData.inviter));
                await inviterSchema.findOneAndUpdate(
                    { guildID: guild.id, userID: inviter.id },
                    { $inc: { leave: 1, total: -1 } },
                    { upsert: true }
                );
                const inviterData = await inviterSchema.findOne({
                    guildID: guild.id,
                    userID: inviter.id,
                });
                const total = inviterData ? inviterData.total : 0;
                const totalInvite = total < 0 ? 0 : total;
                inviteChannel.createMessage(
                    `\`${user.username}#${user.discriminator}\` left our server. They were invited by ${inviter.username}#${inviter.discriminator} (**${totalInvite}** Invites)`
                );
            }

        }

        if(welcomeChannel) {

            welcomeChannel.createMessage(`${user.username}#${user.discriminator} has left the server.`);
        }


    }

}