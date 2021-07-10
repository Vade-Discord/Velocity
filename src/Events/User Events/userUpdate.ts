  import { Event } from '../../Interfaces/Event';
import guildSchema from '../../Schemas/Main Guilds/GuildSchema';

      export default class UserEvent extends Event {
          constructor(client) {
              super(client, "userUpdate", {

              });
          }

          async run(user, oldUser) {

              if (!oldUser) return;

              try {




              const guilds = await guildSchema.find({});
              if (!guilds.length) return;

              for (const i of guilds) if (i?.Logging.user) {
                  let tag = `${user.username}#${user.discriminator}`

                  const channel = this.client.getChannel(i.Logging.user);
                  if (channel) {
                      if (channel.type !== 0) return; // Return if it isn't a text channel.
                      let embed = new this.client.embed()
                          .setColor('#00C09A')
                      // They have a logging channel, now send the updated user property.
                      if (oldUser.username !== user.username) {
                          embed.setTitle(`Username Updated`)
                              .setAuthor(tag, user.avatarURL)
                          .setDescription(`**From:** ${oldUser.username}\n**To:** ${user.username}`)
                          .setTimestamp()

                          await channel.createMessage({embed: embed});
                      }

                      if (oldUser.discriminator !== user.discriminator) {
                          embed
                              .setTitle(`Discriminator Updated`)
                              .setAuthor(tag, user.avatarURL)
                          .setDescription(`**From:** #${oldUser.discriminator}\n**To:** #${user.discriminator}`)
                              .setThumbnail(user.avatarURL)
                              .setTimestamp()

                          await channel.createMessage({embed: embed});
                      }

                      if (oldUser.avatar !== user.avatar) {
                          embed
                              .setTitle(`Avatar Updated`)
                              .setAuthor(tag, user.avatarURL)
                              .setDescription(user.mention)
                              .setThumbnail(user.avatarURL)
                              .setTimestamp()

                          await channel.createMessage({embed: embed});
                      }


                  }

              }

          } catch (e) {
                  return;
              }

          }

      }