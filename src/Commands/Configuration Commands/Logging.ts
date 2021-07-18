import Command from "../../Interfaces/Command";
import guild_schema from "../../Schemas/Main Guilds/GuildSchema";
import {promisify} from "util";
const wait = promisify(setTimeout);

export default class LogCommand extends Command {
    constructor(client) {
        super(client, 'logging', {
            aliases: ["logs", 'setlog', 'logconfig'],
            description: "Configure the guilds logging channels.",
            category: "Configuration",
            userPerms: ['manageMessages'],
            botPerms: ['manageMessages']
        });
    }

    async run(message, args) {

        if (!args.length) {
            return message.channel.createMessage({
                content: `You need to provide a valid logging type. You can type \`!${this.name} help\` for assistance.`,
                messageReference: {messageID: message.id}
            });
        }

        if (!args[0]) return message.channel.createMessage({
            content: `You need to provide a valid channel. You can type \`!${this.name} help\` for assistance.`,
            messageReference: {messageID: message.id}
        });
        const channel = this.client.utils.getChannel(args[0], message.channel.guild);
        if (!channel) return message.channel.createMessage({
            content: `You need to provide a valid channel. You can type \`!${this.name} help\` for assistance.`,
            messageReference: {messageID: message.id}
        });

        let options = [
            {
                label: "Message Logs",
                value: "message",
                description: "Message edits, deletions and more!",
                emoji: {
                    name: "channel",
                    id: "862682453663285301"
                }
            },
            {
                label: "Voice Logs",
                value: "voice",
                description: "Joins, leaves, switches.",
                emoji: {
                    name: "voice",
                    id: "820482408238809099"
                }
            },
            {
                label: "Moderation Logs",
                value: "moderation",
                description: "Bans, kicks and more!",
                emoji: {
                    name: "moderation",
                    id: "858884725484552223"
                }
            },
            {
                label: "User Logs",
                value: "user",
                description: "Avatar, username changes etc.",
                emoji: {
                    name: "channel",
                    id: "862682453663285301"
                }
            },
            {
                label: "Role Logs",
                value: "role",
                description: "Role creations, deletions etc.",
                emoji: {
                    name: "role",
                    id: "825769238736273420"
                }
            }
        ];

        let component = this.client.utils.createSelection(`logging#selection#${message.author.id}#${channel.id}`, 'Configure the logging types!', options, 1, 2);


        message.channel.createMessage({
            content: `${message.author.mention}, please continue via the prompt!`,
            components: component
        });
    }


    async runInteraction(interaction, member, id, extra) {
        if(member.id !== id) return;
            const types = interaction.data.values;
            const { message, channel } = interaction;
            let newGuild = false;
        await interaction.createMessage({ content: `Successfully set the selected types to the specified channel.`, messageReference: { messageID: interaction.message.id }});
       await interaction.message.edit({ content: `Done!`, components: []});
            for(const type of types) {

                let updated = [];
                const locateGuild = (await guild_schema.findOne({ guildID: interaction.member.guild.id })) ?? await this.client.utils.createGuildSchema(interaction.member.guild);
                    await updateThing(locateGuild, type, extra);
                 await wait(1000)
                }


        async function updateThing(thingToUpdate, type, channel) {
            switch(type) {
                case "moderation": {
                    await thingToUpdate.updateOne({
                        Logging: {
                            moderation: channel
                        }
                    });
                    break;
                }
                case "message": {
                    await thingToUpdate.updateOne({
                        Logging: {
                            message: channel
                        }
                    });
                    break;
                }
                case "voice": {
                    await thingToUpdate.updateOne({
                        Logging: {
                            voice: channel
                        }
                    });
                    break;
                }
                case "user": {
                    await thingToUpdate.updateOne({
                        Logging: {
                            user: channel
                        }
                    });
                    break;
                }
                case "role": {
                    await thingToUpdate.updateOne({
                        Logging: {
                            role: channel
                        }
                    });
                    break;
                }
                case "channel": {
                    await thingToUpdate.updateOne({
                        Logging: {
                            channel: channel
                        }
                    });
                    break;
                }
                case "giveaway": {
                    await thingToUpdate.updateOne({
                        Logging: {
                            giveaway: channel
                        }
                    });
                    break;
                }
            }
        }

            }
    }



