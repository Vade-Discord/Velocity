  import { Event } from '../../Interfaces/Event';
import guildSchema from '../../Schemas/Main Guilds/GuildSchema';

      export default class EventName extends Event {
          constructor(client) {
              super(client, "eventName", {

              });
          }

          async run(user, oldUser) {


              const guilds = await guildSchema.find({});
              if(!guilds.length) return;

              for (const i of guilds) {


                  if(i?.Logging.user) {

                      const channel = this.client.getChannel(i.Logging.user);
                      if(channel) {
                          if(channel.type !== 0) return; // Return if it isn't a text channel.
                          // They have a logging channel, now send the updated user property.
                          if(oldUser.username !== user.username) {
                            console.log(`User username updated`);
                          }

                          if(oldUser.discriminator !== user.discriminator) {
                              console.log(`Users tag updated`);
                          }


                      }

                  }
              }

          }

      }