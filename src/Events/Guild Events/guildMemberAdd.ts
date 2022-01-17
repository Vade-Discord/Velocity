import { Event } from '../../Interfaces/Event';
import guildSchema from '../../Schemas/Main-Guilds/GuildSchema';
import inviteMemberSchema from "../../Schemas/Invite Schemas/inviteMember";
import inviterSchema from "../../Schemas/Invite Schemas/inviter";

import autoRoles from '../../Schemas/Main-Guilds/GuildAutoRoles';
import {Invite, TextChannel} from "eris";
import Collection from "@discordjs/collection";

let e;

export default class GuildMemberAddEvent extends Event {
    constructor(client) {
        super(client, "guildMemberAdd", {

        });
    }
// @ts-ignore
    async run(guild, member) {

        e = this.client;
        if((await this.client.redis.get(`antiraid.${guild.id}`))) {
            const embed = new this.client.embed()
                .setAuthor('Anti-Raid is active!')
                .setColor('#F00000')
                .setDescription(`You have been automatically kicked from **${guild.name}** due to the anti-raid module being active. This is automatically disabled after **1 hour**.`)
                .setFooter('Velocity Moderation', this.client.user.avatarURL);

            (await member.user.getDMChannel()).then((e) => {
                e.createMessage({ embeds: [embed] }).catch(() => null);
            }).catch(() => null);
            member.kick(`Anti-Raid is active!`).catch(() => null);

            let moderationEmoji = this.client.constants.emojis.moderation.mention;
            let tag = `${member.user.username}#${member.user.discriminator}`

            const antiRaidTriggered = new this.client.embed()
                .setAuthor(`${tag} kicked due to Anti-Raid`, member.avatarURL)
                .setTitle(`${moderationEmoji} User Kicked`)
                .setDescription(`**User:** ${tag} (${member.id})
Time Kicked: <t:${Date.now()}:d>`)
                .setThumbnail(member.user.avatarURL)
                .setFooter(`Velocity Logging System`)
                .setColor(`#F00000`)
                .setTimestamp();
            const modChannel = (await this.client.utils.loggingChannel(guild, 'moderation'));
            modChannel ? modChannel.createMessage({embeds: [antiRaidTriggered]}) : null;

        }


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
            const gi = JSON.parse((await this.client.redis.get(`invites.${member.guild.id}`)));
                // NEW
            const invite: Invite =  invites.find(async (x) => gi?.find(async (e) => e === x.code && (e.redis.get(`invites.${member.guild.id}.${e}`).uses < x.uses)));

            if(!invite) {
                inviteChannel.createMessage(`${member.mention} joined! Unable to locate who they were invited by.`);
            } else {
                if(invite.code === guild.vanityURL) {
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
                            await this.client.redis.set(`invites.${member.guild.id}.${invite.code}`, JSON.stringify({
                                uses: invite.uses + 1,
                                inviter: invite.inviter,
                                code: invite.code
                            }));
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

                console.log(guildData.welcomeMessage);
                const message = guildData?.welcomeMessage ? await this.client.utils.Interpolate(guildData.welcomeMessage, {
                    username: `${member.username}`,
                    tag: `${member.username}#${member.discriminator}`,
                    id: `${member.id}`,
                    guildName: `${member.guild.name}`,
                    guildID: `${member.guild.id}`,
                    mention: `${member.mention}`
                }) : `${member.mention} has joined the server.`;

              return  welcomeChannel.createMessage(message);
            }
        }


    }

}