  import { Event } from '../../Interfaces/Event';

      export default class RoleCreateEvent extends Event {
          constructor(client) {
              super(client, "guildRoleCreate", {

              });
          }

          async run(guild, role) {

              const embed = new this.client.embed()
                  .setTitle(`@${role.name}`)
                  .setColor("#00C09A")
                  .setAuthor(`Role Created`, guild.iconURL)
                  .setURL('https://vade-bot.com')
                  .setTimestamp();

              const loggingChannel = await this.client.utils.loggingChannel(guild, 'role');
              loggingChannel ? loggingChannel.createMessage({ embed: embed }) : null;


          }

      }