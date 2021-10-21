  import { Event } from '../../Interfaces/Event';

      export default class VoiceUpdateEvent extends Event {
          constructor(client) {
              super(client, "voiceStateUpdate", {

              });
          }

          async run(member, oldState) {

              const tag = `${member.username}#${member.discriminator}`;
              const logging = (await this.client.utils.loggingChannel(member.guild, 'voice'));
              if(!logging) {
                  return;
              }
              const embed = new this.client.embed()
                  .setAuthor(`${tag}`, member.avatarURL)
                  .setFooter(`Vade Logging System`, this.client.user.avatarURL)

              if(!oldState?.muted && member?.muted|| oldState?.muted && !member?.muted) {
                  const mutedOrUnmuted = !(oldState?.muted && !member?.muted);
                     embed
                      .setTitle(`${mutedOrUnmuted ? `🔇 Server-Muted` : '🔊 Server-Unmuted'}`)
                      .setColor(mutedOrUnmuted ? "#00C09A" : "#F00000")
                      .setTimestamp()

                  logging ? logging.createMessage({ embeds: [embed] }) : null;
              }

          }

      }