  import { Event } from '../../Interfaces/Event';

      export default class GuildMemberEvent extends Event {
          constructor(client) {
              super(client, "guildMemberUpdate", {

              });
          }

          async run(guild, member, oldMember) {

              if(!this.client.users.get(member.id)) {
                 return;
              }

              const logChannel = await this.client.utils.loggingChannel(guild, 'user');
              if(!logChannel) return;
              const tag = `${member.user.username}#${member.user.discriminator}`;
              const logEmbed = new this.client.embed()
                  .setAuthor(tag, member.user.avatarURL)
                  .setColor("YELLOW")
                  .setThumbnail(member.user.avatarURL)
                  .setTimestamp()
                  .setFooter(`Vade Logging System`, this.client.user.avatarURL)
              if(!oldMember?.nick && member?.nick || oldMember?.nick !== member?.nick || oldMember?.nick && !member.nick) {
                  logEmbed
                      .setTitle(`Nickname Updated`)
                      .setDescription(`**From:** ${oldMember?.nick ?? 'No Nickname.'}\n**To:** ${member?.nick ?? 'No Nickname.'}`)

                  logChannel.createMessage({ embeds: [logEmbed] });

              }

              if(oldMember.roles?.length && oldMember.roles.length !== member.roles?.length || !oldMember.roles?.length && member.roles?.length) {
                  console.log(`Length check validated`)
                  let roleEmoji = this.client.constants.emojis.role.mention;
                  let removed = oldMember?.roles.length ? oldMember?.roles.filter(role => !member?.roles.includes(role)) : null;
                  let added = member?.roles.length ? member.roles.filter(role => !oldMember?.roles.includes(role)) : null;
                  if(!added?.length && removed.length) {
                      let removedRole = guild.roles.get(removed[0]);
                      logEmbed
                          .setTitle(`${roleEmoji} Role Removed`)
                          .setDescription(`**Role Removed:** ${removedRole.mention}`)
                          .setColor("#F00000")

                      logChannel.createMessage({ embeds: [logEmbed] });
                      // or   logChannel.createMessage({ embed: embed  });
                  } else if(added?.length && !removed?.length) {
                      let addedRole = guild.roles.get(added[0]);
                      logEmbed
                          .setTitle(`${roleEmoji} Role Added`)
                          .setDescription(`**Role Added:** ${addedRole.mention}`)
                          .setColor("#00C09A")

                      logChannel.createMessage({ embeds: [logEmbed] });
                  } else {
                     return;
                  }
              } // Role Changes end here.

              if(!oldMember.premiumSince && member.premiumSince) {
                  let boostEmoji = this.client.constants.emojis.boost.mention;
                  logEmbed
                      .setTitle(`${boostEmoji} Premium Updated`)
                      .setDescription(`**Boosted the Server!**`)
                      .setColor(`#f47fff`)

                  logChannel.createMessage({ embeds: [logEmbed] });
              } else if(oldMember.premiumSince && !member.premiumSince) {
                  let boostEmoji = this.client.constants.emojis.boost.mention;
                  logEmbed
                      .setTitle(`${boostEmoji} Premium Updated`)
                      .setDescription(`**Stopped Boosting :(**`)
                      .setColor(`#f47fff`)

                  logChannel.createMessage({ embeds: [logEmbed] });
              }

              if(oldMember.pending && !member.pending) {
                  logEmbed
                      .setTitle(`Passed Membership Screening `)
                      .setDescription(`**They passed the membership screening!**`)
                      .setColor(`#00C09A`)

                  logChannel.createMessage({ embeds: [logEmbed] });
              }

          }

      }