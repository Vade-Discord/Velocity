import Command from "../../Interfaces/Command";
import guildSchema from "../../Schemas/Main Guilds/GuildSchema";

export default class LoggingCommand extends Command {
    constructor(client) {
        super(client, 'logging', {
            aliases: [""],
            description: "Set a logging channel for the specified type.",
            category: "Configuration",
            userPerms: ['manageGuild'],
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
                }
            ],
        });
    }
    async run(interaction, member) {
        const guildData = await guildSchema.findOne({ guildID: interaction.guildID });
        const c = interaction.data.options?.filter(m => m.name === "channel")[0]?.value;
        const channel = await this.client.getRESTChannel(c);

      if(!channel) {
        return interaction.createFollowup(`Oops! Looks like you didn't provide a channel!`);
        }

        const type = interaction.data.options?.filter(m => m.name === "type")[0]?.value;
        if(type) {
            const validTypes: string[] = ['message', 'voice', 'role', 'moderation', 'channel', 'user'];
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

        switch(type?.toLowerCase()) {
            case "message": {
                console.log(`Message option selected`)
                break;
            }

            case "voice": {
                console.log(`Voice option selected`)
                break;
            }

            case "moderation": {
                console.log(`Moderation option selected`)
                break;
            }


            case "user": {
                console.log(`User option selected`)
                break;
            }

            case "channel": {
                console.log(`Channel option selected`)
                break;
            }

            default: {
                return console.log(`No option?`);
            }

        }




    }

}
