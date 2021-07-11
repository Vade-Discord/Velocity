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

              if(!oldChannel) return;

              try {
                  if(member.id === this.client.user.id) {
                      const player = this.client.manager.players.get(oldChannel.guild.id);
                      if(player) {
                          console.log(`Located player`)
                          await player.destroy();
                      }
                  }

                  const voiceMembers = Array.from(oldChannel.voiceMembers)
                  let userCount = 0

                  for(const i in voiceMembers) {
                      if(!voiceMembers[i][1].user.bot) userCount++
                  }

                  if(userCount === 0) {
                      const player = this.client.manager.players.get(oldChannel.guild.id)
                      if(player) {
                          console.log(`Located player`)
                          await player.destroy()
                      }
                  }

                    let timeTracking = false;
                    let time;
                  const locateSchema = await vcSchema.findOne({ user: member.id });
                  if(locateSchema) {
                    timeTracking = true;
                   const totalTime = Date.now() - parseInt(locateSchema.Join.time);
                   console.log(locateSchema.Join.time)
                   console.log(totalTime)
                   time = humanize(totalTime);
                  await locateSchema.delete()
                  }


                  let tag = `${member.user.username}#${member.user.discriminator}`
                  let embed = new this.client.embed()
                      .setAuthor(tag, member.user.avatarURL)
                      .setTitle(`📤 Left Voice Channel`)
                      .setDescription(`**Channel:** ${oldChannel.mention}\n\n${timeTracking ? `Time Spent: ${time}` : null}`)
                      .setThumbnail(member.user.avatarURL)
                      .setFooter(`Vade Logging System`)
                      .setColor(`#F00000`)
                      .setTimestamp();

                  const logChannel = await this.client.utils.loggingChannel(oldChannel.guild, 'voice');
                  logChannel ? logChannel.createMessage({ embed: embed }) : null;


              } catch (e) {
                  console.log(e)
              }


          }

      }