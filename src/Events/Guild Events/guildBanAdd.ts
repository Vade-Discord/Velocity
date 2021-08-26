  import { Event } from '../../Interfaces/Event';

      export default class BanAddEvent extends Event {
          constructor(client) {
              super(client, "guildBanAdd", {

              });
          }

          async run(guild, user) {

              if(!user) return;
            let moderationEmoji = this.client.constants.emojis.moderation.mention;
              let tag = `${user.username}#${user.discriminator}`
              let embed = new this.client.embed()
                  .setAuthor(tag, user.avatarURL)
                  .setTitle(`${moderationEmoji} User Banned`)
                  .setDescription(`**User:** ${tag} (${user.id})
Time Banned: <t:${Date.now()}:d>`)
                  .setThumbnail(user.avatarURL)
                  .setFooter(`Vade Logging System`)
                  .setColor(`#F00000`)
                  .setTimestamp();

              const logChannel = await this.client.utils.loggingChannel(guild, 'moderation');
              logChannel ? logChannel.createMessage({ embeds: [embed] }) : null;
          }

      }