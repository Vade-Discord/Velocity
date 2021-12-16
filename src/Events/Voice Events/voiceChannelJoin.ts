import { Event } from '../../Interfaces/Event';
import ms from 'ms';
import vcSchema from '../../Schemas/User Schemas/Voice';

export default class VcJoinEvent extends Event {
            constructor(client) {
                super(client, "voiceChannelJoin", {
                });
            }

            async run(member, newChannel) {
                if(!newChannel) return;
                if(member.user.id === this.client.user.id && newChannel.type === 13) {
                    await member.guild.editVoiceState({channelID: newChannel.id, suppress: false }).catch(async () => {
                        await member.guild.editVoiceState({channelID: newChannel.id, requestToSpeakTimestamp: new Date(Date.now()) }).catch(() => null);
                    });
               //     await member.guild.editVoiceState({channelID: newChannel.id, requestToSpeakTimestamp: new Date(Date.now()), suppress: false }).catch(() => null);
                }


                try {
                    let tag = `${member.user.username}#${member.user.discriminator}`
                    let embed = new this.client.embed()
                        .setAuthor(tag, member.user.avatarURL)
                        .setTitle(`📥 Joined Voice Channel`)
                        .setDescription(`**Channel:** ${newChannel.mention}`)
                        .setThumbnail(member.user.avatarURL)
                        .setFooter(`Velocity Logging System`)
                        .setColor(`#00C09A`)
                        .setTimestamp();

                    const logChannel = await this.client.utils.loggingChannel(newChannel.guild, 'voice');
                    logChannel ? logChannel.createMessage({ embeds: [embed] }) : null;
                    let joinTime = Date.now();
                    await this.client.redis.set(`vcTrack.${newChannel.guild.id}.${member.id}`, joinTime, 'EX', 86400);

                } catch (e) {
                    console.log(e)
                }




            }

        }