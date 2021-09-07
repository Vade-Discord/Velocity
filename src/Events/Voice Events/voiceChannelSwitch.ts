  import { Event } from '../../Interfaces/Event';

      export default class VoiceSwitchEvent extends Event {
          constructor(client) {
              super(client, "voiceChannelSwitch", {

              });
          }

          async run(member, newChannel, oldChannel) {
            if(!newChannel || !oldChannel) return;
              try {
                  let tag = `${member.user.username}#${member.user.discriminator}`
                  let embed = new this.client.embed()
                      .setAuthor(tag, member.user.avatarURL)
                      .setTitle(`🔀 Voice Channel Changed`)
                      .setDescription(`**From:** ${oldChannel.mention}\n**To:** ${newChannel.mention}`)
                      .setThumbnail(member.user.avatarURL)
                      .setFooter(`Vade Logging System`)
                      .setColor(`YELLOW`)
                      .setTimestamp();

                  const logChannel = await this.client.utils.loggingChannel(oldChannel.guild, 'voice');
                  logChannel ? logChannel.createMessage({ embeds: [embed] }) : null;
              } catch (e) {
                  console.log(e)
              }

          }

      }