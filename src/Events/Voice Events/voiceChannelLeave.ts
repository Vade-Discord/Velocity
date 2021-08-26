  import { Event } from '../../Interfaces/Event';
  import vcSchema from '../../Schemas/User Schemas/Voice';
  import humanize from 'humanize-duration';
  import ms from 'ms';

      export default class VoiceLeaveEvent extends Event {
          constructor(client) {
              super(client, "voiceChannelLeave", {

              });
          }

          async run(member, oldChannel) {

              if (!oldChannel) return;
              const player = this.client.manager?.players.get(oldChannel.guild.id);

              try {
                  const voiceMembers = Array.from(oldChannel.voiceMembers)
                  let userCount = 0

                  for (const i in voiceMembers) {
                      if (!voiceMembers[i][1].user.bot) userCount++
                  }

                  if (oldChannel.voiceMembers.get(this.client.user.id) && userCount === 0) {
                      //console.log("Located player")
                      await oldChannel.leave()
                  }

                    let timeTracking = false;
                    let time;
                  const locateSchema = await this.client.redis.get(`vcTrack.${oldChannel.guild.id}.${member.id}`);
                  if(locateSchema) {
                      timeTracking = true;
                      const totalTime = Date.now() - parseInt(locateSchema);
                      time = humanize(totalTime);
                      await this.client.redis.del(`vcTracking.${oldChannel.guild.id}.${member.id}`);
                      const totalSchema = await vcSchema.findOne({user: member.id, guild: oldChannel.guild.id});
                      if (totalSchema) {
                        await totalSchema.updateOne({
                            $inc: {total: totalTime}
                        });
                      } else {
                          const newSchema = new vcSchema({
                              user: member.id,
                              guild: oldChannel.guild.id,
                              username: `${member.username}#${member.discriminator}`,
                              total: totalTime
                          });
                          await newSchema.save();
                      }

                  }

                  let tag = `${member.user.username}#${member.user.discriminator}`
                  let embed = new this.client.embed()
                      .setAuthor(tag, member.user.avatarURL)
                      .setTitle(`📤 Left Voice Channel`)
                      .setDescription(`**Channel:** ${oldChannel.mention}\n\n${timeTracking ? `Time Spent: ${time ?? 'Unable to track.'}` : null}`)
                      .setThumbnail(member.user.avatarURL)
                      .setFooter(`Vade Logging System`)
                      .setColor(`#F00000`)
                      .setTimestamp();

                  const logChannel = await this.client.utils.loggingChannel(oldChannel.guild, 'voice');
                  logChannel ? logChannel.createMessage({ embeds: [embed] }) : null;


              } catch (e) {
                  console.log(e)
              }


          }

      }