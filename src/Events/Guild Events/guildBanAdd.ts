  import { Event } from '../../Interfaces/Event';

      export default class BanAddEvent extends Event {
          constructor(client) {
              super(client, "guildBanAdd", {

              });
          }

          async run(guild, user) {

              console.log('Ban fired')

              if(!user) {
                  user = (await this.client.getRESTUser(user.id))!!;
              }
              console.log('Past member check')
            let moderationEmoji = this.client.constants.emojis.moderation.mention;
              let tag = `${user.username}#${user.discriminator}`
              let embed = new this.client.embed()
                  .setAuthor(tag, user.avatarURL)
                  .setTitle(`${moderationEmoji} User Banned`)
                  .setDescription(`**User:** ${tag} (${user.id})
Time Banned: <t:${Date.now()}:d>`)
                  .setThumbnail(user.avatarURL)
                  .setFooter(`Velocity Logging System`)
                  .setColor(`#F00000`)
                  .setTimestamp();

              const components =  [{
                  type: 1,
                  components: [
                      {
                          type: 2,
                          style: 4,
                          label: "Unban",
                          custom_id: `banLog#${user.id}`
                      },
                  ]
              }]

              const logChannel = await this.client.utils.loggingChannel(guild, 'moderation');
              logChannel ? logChannel.createMessage({ embeds: [embed], components }) : null;
          }

      }