import { Event } from "../../interfaces/Event";


    export default class MessageEvent extends Event {
            constructor(client) {
                super(client, "messageCreate", {
                });
            }
            async run(message) {
                if(message.author.bot) return;

                if(!this.client.getChannel(message.channel.id)) message.channel = await this.client.getRESTChannel(message.channel.id);

                let mainPrefix;
                if(message.channel.guild) {
                    mainPrefix = await this.client.utils.resolvePrefix(message.channel.guild.id);
                } else {
                    mainPrefix = this.client.config.prefix;
                }
                const check = await this.client.utils.checkModerator(message);

                const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);
                const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : mainPrefix;
                if(message.content?.toLowerCase().startsWith(prefix)) {

                    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
                    const command = this.client.commands.get(cmd?.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd?.toLowerCase()));


                    if(message.content.match(mentionRegexPrefix) && !cmd) {
                        const prefixEmbed = new this.client.embed()
                            .setAuthor(`Prefix`, this.client.user.avatarURL)
                            .setFooter(`Vade`, this.client.user.avatarURL)
                            .setTimestamp()
                            .setDescription(`Global Prefix: ${this.client.user.mention}\n\nServer Prefix: ** ${mainPrefix} **`)
                            .setColor('#F00000')

                        return message.channel.createMessage({ embeds: [prefixEmbed], messageReference: { messageID: message.id }});
                    }

                    if(!command) return;

                    const check =  await this.client.utils.runPreconditions(message, command, args);
                    if(check) return;

                    try {
                        await command.run(message, args);
                    } catch (e) {
                        let embed = new this.client.embed()
                            .setTitle(`An error has occured!`)
                            .setDescription(`\`${e}\``)
                            .setColor(`#f00000`);

                        return message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});
                    }

                }
                
            }
    
        }