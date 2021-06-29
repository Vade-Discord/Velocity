import { Event } from '../../Interfaces/Event';

export default class VcJoinEvent extends Event {
            constructor(client) {
                super(client, "voiceChannelJoin", {
                });
            }

            async run(member, newChannel) {
                if(!newChannel) return;

                try {
                    let tag = `${member.user.username}#${member.user.discriminator}`
                    let embed = new this.client.embed()
                        .setAuthor(tag, member.user.avatarURL)
                        .setTitle(`📥 Joined Voice Channel`)
                        .setDescription(`**Channel:** ${newChannel.mention}`)
                        .setThumbnail(member.user.avatarURL)
                        .setFooter(`Vade Logging System`)
                        .setColor(`#00C09A`)
                        .setTimestamp();

                    const logChannel = await this.client.utils.loggingChannel(newChannel.guild, 'voice');
                    logChannel ? logChannel.createMessage({ embed: embed }) : null;
                } catch (e) {
                    console.log(e)
                }




            }

        }