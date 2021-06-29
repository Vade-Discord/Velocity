  import { Event } from '../../Interfaces/Event';

      export default class VoiceLeaveEvent extends Event {
          constructor(client) {
              super(client, "voiceChannelLeave", {

              });
          }

          async run(member, oldChannel) {

              if(!oldChannel) return;

              try {
                  let tag = `${member.user.username}#${member.user.discriminator}`
                  let embed = new this.client.embed()
                      .setAuthor(tag, member.user.avatarURL)
                      .setTitle(`📤 Left Voice Channel`)
                      .setDescription(`**Channel:** ${oldChannel.mention}`)
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