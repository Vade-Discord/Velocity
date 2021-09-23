import Command from "../../Interfaces/Command";
import guildSchema from "../../Schemas/Main-Guilds/GuildSchema";

export default class LoggingCommand extends Command {
    constructor(client) {
        super(client, 'notification', {
            aliases: [""],
            description: "Configure your user-specific notification settings.",
            category: "Configuration",
            options: [
                {
                    type: 3,
                    name: 'type',
                    description: `Which notification setting you would like to change.`,
                    required: true,
                    choices: [
                        {
                            name: 'robbery attempts',
                            value: 'robbery'
                        },
                        {
                            name: 'giveaway wins/losses',
                            value: 'giveaway'
                        },
                        {
                            name: 'moderation actions',
                            value: 'moderation',
                        },
                        {
                            name: 'economy actions',
                            value: 'economy',
                        },
                        {
                            name: 'faction related actions',
                            value: 'faction'
                        }
                    ]
                },
            ],
        });

    }


    async run(interaction, member, options, subOptions) {
        const profileData = (await this.client.utils.getProfileSchema(member.id))!!;


        const type = options.get(`type`);
        if(type) {
            const validTypes: string[] = ['robbery', 'moderation', 'giveaway', 'economy'];
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

        const object = profileData.Notifications;
        let t;

        switch(type?.toLowerCase()) {
            case "robbery": {
              if(object["robbery"]) {
                  object.robbery = false;
                  t = false;
              } else {
                  object.robbery = true;
                  t = true;
              }
                await profileData.updateOne({
                    Notifications: object
                });
                interaction.createFollowup(`Successfully ${t ? 'enabled' : 'disabled'} the **${type?.toLowerCase()}** notification setting.`);
                break;
            }
            case "moderation": {
                if(object["moderation"]) {
                    object.moderation = false;
                    t = false;
                } else {
                    object.moderation = true;
                    t = true;
                }
                await profileData.updateOne({
                    Notifications: object
                });
                interaction.createFollowup(`Successfully ${t ? 'enabled' : 'disabled'} the **${type?.toLowerCase()}** notification setting.`);
                break;
            }
            case "faction": {
                if(object["faction"]) {
                    object.faction = false;
                    t = false;
                } else {
                    object.faction = true;
                    t = true;
                }
                await profileData.updateOne({
                    Notifications: object
                });
                interaction.createFollowup(`Successfully ${t ? 'enabled' : 'disabled'} the **${type?.toLowerCase()}** notification setting.`);
                break;
            }
            case "economy": {
                if(object["economy"]) {
                    object.economy = false;
                    t = false;
                } else {
                    object.economy = true;
                    t = true;
                }
                await profileData.updateOne({
                    Notifications: object
                });
                interaction.createFollowup(`Successfully ${t ? 'enabled' : 'disabled'} the **${type?.toLowerCase()}** notification setting.`);
                break;
            }
            case "giveaway": {
                if(object["giveaway"]) {
                    object.giveaway = false;
                    t = false;
                } else {
                    object.giveaway = true;
                    t = true;
                }
                await profileData.updateOne({
                    Notifications: object
                });
                interaction.createFollowup(`Successfully ${t ? 'enabled' : 'disabled'} the **${type?.toLowerCase()}** notification setting.`);
                break;
            }


            default: {
                return console.log(`No option?`);
            }

        }




    }

}
