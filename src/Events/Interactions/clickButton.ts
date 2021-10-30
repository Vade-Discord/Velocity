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
                            const muteData = (await muteSchema.findOne({ userID: mutedMemberID, guildID: interaction.guildID }));
                            if(muteData) {
                                await this.client.utils.muteEnded(muteData);
                                interaction.createMessage({ content: 'Successfully unbanned!', flags: 64 });
                            } else {
                                interaction.createMessage({ content: 'There was no mute data found, that member must already be unmuted.', flags: 64 });
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