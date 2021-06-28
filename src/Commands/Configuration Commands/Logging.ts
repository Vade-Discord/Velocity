import Command from "../../Interfaces/Command";
import guild_schema from "../../Schemas/Main Guilds/GuildSchema";

export default class LogCommand extends Command {
    constructor(client) {
        super(client, 'logging', {
            aliases: ["logs", 'setlog', 'logconfig'],
            description: "Configure the guilds logging channels.",
            category: "Configuration",
        });
    }
    async run(message, args) {

        if(!args.length) {
            return message.channel.createMessage({ content: `You need to provide a valid logging type. You can type \`!${this.name} help\` for assistance.`, messageReference: { messageID: message.id }});
        }

        const valid: string[] = ['moderation', 'message', 'voice', 'user', 'role', 'channel', 'giveaway'];

        if(args[0]?.toLowerCase() === 'help') {
            let helpEmbed = new this.client.embed()
                .setTitle(`${this.client.utils.capitalise(this.name)} Command Assistance`)
                .setDescription(`You can use the following logging types: \n\n${valid.join("\n")} \n\n Example: \`!${this.name} message ${message.channel}`)
                .setColor(`#F00000`)
                .setTimestamp()
                .setFooter(`Vade Configuation`, this.client.user.avatarURL);

          return message.channel.createMessage({ embed: helpEmbed, messageReference: { messageID: message.id }});
        }

        if(!valid.includes(args[0]?.toLowerCase())) return message.channel.createMessage({ content: `You need to provide a valid logging type. You can type \`!${this.name} help\` for assistance.`, messageReference: { messageID: message.id }});
        let newGuild;
        const type = args[0]?.toLowerCase();
        if(!args[1]) return message.channel.createMessage({ content: `You need to provide a valid channel. You can type \`!${this.name} help\` for assistance.`, messageReference: { messageID: message.id }});
        const channel = this.client.utils.getChannel(args[1], message.channel.guild);
        if(!channel) return message.channel.createMessage({ content: `You need to provide a valid channel. You can type \`!${this.name} help\` for assistance.`, messageReference: { messageID: message.id }});

    console.log(type)


        const locateGuild = (await guild_schema.findOne({ guildID: message.guildID })) ?? await this.client.utils.createGuildSchema(message.channel.guild).then(async (guild) => {
            await updateThing(guild, type, channel);
            newGuild = true;
            return message.channel.createMessage({ content: `Successfully updated the \`${type}\` channel configuration to: ${channel.mention}.`, messageReference: { messageID: message.id }});
        });

    if(newGuild) return;

    await updateThing(locateGuild, type, channel);
        return message.channel.createMessage({ content: `Successfully updated the \`${type}\` channel configuration to: ${channel.mention}.`, messageReference: { messageID: message.id }});

     }

    }

    async function updateThing(thingToUpdate, type, channel) {
        switch(type) {
            case "moderation": {
                await thingToUpdate.updateOne({
                    Logging: {
                        moderation: channel.id
                    }
                });
                break;
            }
            case "message": {
                await thingToUpdate.updateOne({
                    Logging: {
                        message: channel.id
                    }
                });
                break;
            }
            case "voice": {
                await thingToUpdate.updateOne({
                    Logging: {
                        voice: channel.id
                    }
                });
                break;
            }
            case "user": {
                await thingToUpdate.updateOne({
                    Logging: {
                        user: channel.id
                    }
                });
                break;
            }
            case "role": {
                await thingToUpdate.updateOne({
                    Logging: {
                        role: channel.id
                    }
                });
                break;
            }
            case "channel": {
                await thingToUpdate.updateOne({
                    Logging: {
                        channel: channel.id
                    }
                });
                break;
            }
            case "giveaway": {
                await thingToUpdate.updateOne({
                    Logging: {
                        giveaway: channel.id
                    }
                });
                break;
            }
        }
    }