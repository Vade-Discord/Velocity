import { Event } from '../../Interfaces/Event';
import muteSchema from '../../Schemas/Backend/Muted';

export default class InteractionCreateEvent extends Event {
    constructor(client) {
        super(client, "clickButton", {

        });
    }

    async run(interaction, member, mainOptions, subOptions) {

        const guild = (await this.client.getRESTGuild(interaction.guildID))!!;
        const isModerator = (await this.client.utils.checkModerator(member, guild));

                    const data = interaction.data.custom_id;
                    const args = data.split("#");
                    const cmd = args[0];

                    switch(cmd) {

                        case "pagination": {
                            await interaction.acknowledge();
                            const pages = await this.client.Pagination.get(interaction.message.id)
                            //@ts-ignore
                            pages.run(interaction);

                            break;
                        }

                        case "banLog": {

                            console.log('Ban log button clicked');

                            if(!isModerator) {
                                return interaction.createMessage({ content: 'You must be a server moderator to use this!', flags: 64 });
                            }
                            const bannedMemberID = args[1];
                            const bannedMembers = (await guild.getBans());
                            if(bannedMembers.filter((m) => m.user.id === bannedMemberID).length < 1) {
                                return interaction.createMessage({ content: `That member is no longer banned.`, flags: 64 });
                            }

                            await guild.unbanMember(bannedMemberID, `${member.username}#${member.discriminator} unbanned the member.`).catch(() => {
                                return interaction.createMessage({ content: 'I must be missing the ban members permission.', flags: 64 });
                            });
                            interaction.createMessage({ content: 'Successfully unbanned!', flags: 64 });


                            break;
                        }

                        case "muteLog": {

                            console.log('Ban log button clicked');

                            if(!isModerator) {
                                return interaction.createMessage({ content: 'You must be a server moderator to use this!', flags: 64 });
                            }
                            const mutedMemberID = args[1];
                            const timerCheck = (await this.client.redis.get(`mute.${mutedMemberID}.${interaction.guildID}`));
                            if(!timerCheck) {
                               return interaction.createMessage({ content: 'There was no mute data found, that member must already be unmuted.', flags: 64 });
                            }
                            await this.client.redis.del(`mute.${mutedMemberID}.${interaction.guildID}`);
                            const muteData = (await muteSchema.findOne({ userID: mutedMemberID, guildID: interaction.guildID }));
                            if(muteData) {
                                await this.client.utils.muteEnded(muteData);
                                interaction.createMessage({ content: 'Successfully removed that mute!', flags: 64 });
                            } else {
                                interaction.createMessage({ content: 'There was no mute data found, that member must already be unmuted.', flags: 64 });
                            }



                            break;

                        }

                        case "userinfo": {

                            if(!isModerator) {
                                return interaction.createMessage({ content: 'You must be a server moderator to use this!', flags: 64 });
                            }
                            const MemberID = args[2];
                            switch (args[1]) {

                                case "mute": {

                                    interaction.createMessage({ content: `This feature is still being worked on, feel free to follow the progress @ discord.gg/DFa5wNFWgP.`, flags: 64 })

                                    break;
                                }

                                case "unmute": {
                                    const timerCheck = (await this.client.redis.get(`mute.${MemberID}.${interaction.guildID}`));
                                    if(!timerCheck) {
                                        return interaction.createMessage({ content: 'There was no mute data found, that member must already be unmuted.', flags: 64 });
                                    }
                                    await this.client.redis.del(`mute.${MemberID}.${interaction.guildID}`);
                                    const muteData = (await muteSchema.findOne({ userID: MemberID, guildID: interaction.guildID }));
                                    if(muteData) {
                                        await this.client.utils.muteEnded(muteData);
                                        interaction.createMessage({ content: 'Successfully removed that mute!', flags: 64 });
                                    } else {
                                        interaction.createMessage({ content: 'There was no mute data found, that member must already be unmuted.', flags: 64 });
                                    }

                                    break;
                                }

                                case "kick": {

                                    const m = (await member.guild.getMember(MemberID));
                                    if(!m) {
                                        return interaction.createMessage({ content: 'That user is not in this server!', flags: 64 });
                                    }
                                    const hierarchy = await this.client.utils.roleHierarchy(interaction.guildID, member.id, m.id)
                                    const botHierarchy = await this.client.utils.roleHierarchy(interaction.guildID, this.client.user.id, m.id)
                                    if (!hierarchy) {
                                        return interaction.createMessage({
                                            content: `Could not kick ${m.username}#${m.discriminator} due to them having a higher role than you.`,
                                            flags: 64
                                        });
                                    }
                                    if (m.id === member.id) {
                                        return interaction.createMessage({
                                            content: `You cannot kick yourself.`,
                                            flags: 64
                                        });
                                    }
                                    if (m.id === this.client.user.id) {
                                        return interaction.createMessage({
                                            content: `You cannot kick the bot with the bot.`,
                                            flags: 64
                                        });
                                    }
                                    if (!botHierarchy) {
                                        return interaction.createMessage({
                                            content: `Could not kick ${m.username}#${m.discriminator} due to them having a higher role then me.`,
                                            flags: 64
                                        });
                                    }
                                    m.kick(`${m.username} was kicked by ${member.username}.`).catch(() => {
                                        return interaction.createMessage({
                                            content: 'I was unable to kick that user.',
                                            flags: 64
                                        });
                                    });
                                    await interaction.createMessage({
                                        content: `Successfully kicked ${m.username}#${m.discriminator}`,
                                        flags: 64
                                    });

                                   await interaction.editOriginalMessage({ components: [] });

                                    break;

                                }

                                case "ban": {
                                    const m = (await member.guild.getMember(MemberID));
                                    if(!m) {
                                        return interaction.createMessage({ content: 'That user is not in this server!', flags: 64 });
                                    }
                                    const hierarchy = await this.client.utils.roleHierarchy(interaction.guildID, member.id, m.id)
                                    const botHierarchy = await this.client.utils.roleHierarchy(interaction.guildID, this.client.user.id, m.id)
                                    if (!hierarchy) {
                                        return interaction.createMessage({
                                            content: `Could not ban ${m.username}#${m.discriminator} due to them having a higher role than you.`,
                                            flags: 64
                                        });
                                    }
                                    if (m.id === member.id) {
                                        return interaction.createMessage({
                                            content: `You cannot ban yourself.`,
                                            flags: 64
                                        });
                                    }
                                    if (m.id === this.client.user.id) {
                                        return interaction.createMessage({
                                            content: `You cannot ban the bot with the bot.`,
                                            flags: 64
                                        });
                                    }
                                    if (!botHierarchy) {
                                        return interaction.createMessage({
                                            content: `Could not ban ${m.username}#${m.discriminator} due to them having a higher role then me.`,
                                            flags: 64
                                        });
                                    }
                                    m.ban(`${m.username} was banned by ${interaction.author.username}.`).catch(() => {
                                        return interaction.createMessage({
                                            content: 'I was unable to ban that user.',
                                            flags: 64
                                        });
                                    });
                                    interaction.createMessage({
                                        content: `Successfully banned ${m.username}#${m.discriminator}`,
                                        flags: 64
                                    });



                                    break;
                                }

                            }



                            break;
                        }


                        default: {
                            await interaction.acknowledge();
                            const command = this.client.commands.get(cmd);
                            if (!command || !command.run) return;
                            await command.run(interaction, member, mainOptions, subOptions);
                            setTimeout((e) => {
                                mainOptions.clear();
                                subOptions.clear();
                            }, 10000)

                            break;
                        }


                    }



    };

}