import Command from "../../Interfaces/Command";
import guildSchema from "../../Schemas/Main-Guilds/GuildSchema";

export default class LoggingCommand extends Command {
    constructor(client) {
        super(client, 'logging', {
            aliases: [""],
            description: "Set a logging channel for the specified type.",
            category: "Configuration",
            userPerms: ['manageGuild'],
            options: [
                {
                    type: 1,
                    name: 'add',
                    description: `Set a logging channel for the specified type.`,
                    options: [
                        {
                            type: 7,
                            name: 'channel',
                            description: `The channel to recieve the logging option selected.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'type',
                            description: `The logging option that you would like to set.`,
                            required: true,
                            choices: [
                                {
                                    name: 'message changes',
                                    value: 'message',
                                },
                                {
                                    name: 'voice activity',
                                    value: 'voice',
                                },
                                {
                                    name: 'moderation actions',
                                    value: 'moderation',
                                },
                                {
                                    name: 'welcome channel',
                                    value: 'welcome',
                                },
                                {
                                    name: 'invite channel',
                                    value: 'invites',
                                },
                                {
                                    name: 'user changes',
                                    value: 'user',
                                },
                                {
                                    name: 'channel updates',
                                    value: 'channel',
                                },
                                {
                                    name: 'suggestion channel',
                                    value: 'suggestion'
                                }
                            ]
                        },
                    ]
                },
            ],
        });
    }
    async run(interaction, member, options, subOptions) {
        const guild = await this.client.getRESTGuild(interaction.guildID);
        const guildData = (await this.client.utils.getGuildSchema(interaction.guildID))!!;
        const c = subOptions.get(`channel`);
        const channel = await this.client.getRESTChannel(c);

      if(!channel) {
        return interaction.createFollowup(`Oops! Looks like you didn't provide a channel!`);
        }

        const type = subOptions.get(`type`);
        if(type) {
            const validTypes: string[] = ['message', 'voice', 'role', 'moderation', 'channel', 'user', 'welcome', 'invites', 'suggestion'];
            if(!validTypes.includes(type?.toLowerCase())) {
                const invalidEmbed = new this.client.embed()
                    .setAuthor(`Invalid Option!`, this.client.user.avatarURL)
                    .setDescription(`Looks like an invalid option was selected. Valid options: \n\n${validTypes.join(",\n")}`)
                    .setColor('#F00000')
                return interaction.createFollowup({ embeds: [invalidEmbed]});
            }

        } else {
            return interaction.createFollowup(`Oops! Looks like you didn't provide a type!`);
        }

        const object = guildData.Logging;

        switch(type?.toLowerCase()) {
            case "message": {
                object.message = channel.id;
                await guildData.updateOne({
                    Logging: {
                        object
                    }
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }

            case "welcome": {
                object.welcome = channel.id
                await guildData.updateOne({
                  Logging: object
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }

            case "invites": {
                object.invites = channel.id;
                await guildData.updateOne({
                   Logging: object
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }

            case "voice": {
                object.voice = channel.id;
                await guildData.updateOne({
                    Logging: object
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }

            case "moderation": {
                object.moderation = channel.id;
                await guildData.updateOne({
                    Logging: object
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }


            case "user": {
                object.user = channel.id;
                await guildData.updateOne({
                    Logging: object
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }

            case "suggestion": {
                await guildData.updateOne({
                   Suggestion: channel.id
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }

            case "channel": {
                object.channel = channel.id;
                await guildData.updateOne({
                    Logging: object
                });
                interaction.createFollowup(`Successfully updated the **${type?.toLowerCase()}** logging channel.`);
                break;
            }

            default: {
                return console.log(`No option?`);
            }

        }




    }

}
