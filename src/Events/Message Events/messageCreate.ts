import { Event } from "../../interfaces/Event";


    export default class MessageEvent extends Event {
            constructor(client) {
                super(client, "messageCreate", {
                });
            }
            async run(message) {
                if(message.author.bot) return;

                if(!this.client.getChannel(message.channel.id)) message.channel = await this.client.getRESTChannel(message.channel.id)

                let prefix;
                if(message.channel.guild) {
                    prefix = await this.client.utils.resolvePrefix(message.channel.guild.id);
                } else {
                    prefix = this.client.config.prefix;
                }
                const check = await this.client.utils.checkModerator(message);


                if(message.content?.toLowerCase().startsWith(prefix)) {

                    const args = message.content.slice(prefix.length).trim().split(' ');
                    let cmd = args.shift().toLowerCase();

                    const command = this.client.commands.get(cmd?.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd?.toLowerCase()));
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