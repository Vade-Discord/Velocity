import Command from "../../Interfaces/Command";
import guildSchema from "../../Schemas/Main Guilds/GuildSchema";

export default class GiveawayCommand extends Command {
    constructor(client) {
        super(client, 'giveaway', {
            aliases: [""],
            description: "Contains all of the different giveaway options.",
            category: "Configuration",
            userPerms: ['manageMessages'],
            options: [
                {
                    type: 1,
                    name: 'start',
                    description: 'Begin a giveaway in the current server.',
                    options: [
                        {
                            type: 7,
                            name: 'channel',
                            description: `The channel the giveaway should be hosted in.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'time',
                            description: `The length of time for the giveaway.`,
                            required: true,
                        },
                        {
                            type: 10,
                            name: 'winners',
                            description: `The amount of winners.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'prize',
                            description: `The prize for the giveaway.`,
                            required: true,
                        },
                    ]
                },
                {
                    type: 1,
                    name: 'end',
                    description: `End a giveaway.`,
                    options: [
                        {
                            type: 3,
                            name: 'message-id',
                            description: `The message ID of the giveaway.`,
                            required: true,
                        },
                    ]
                },
                {
                    type: 1,
                    name: 'edit',
                    description: `Edit a giveaway and change the prize, time or winner count.`,
                    options: [
                        {
                            type: 3,
                            name: 'message-id',
                            description: `The message ID of the giveaway.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'prize',
                            description: `The new prize for the giveaway.`,
                            required: false,
                        },
                        {
                            type: 3,
                            name: 'time',
                            description: `The new length of time for the giveaway.`,
                            required: false,
                        },
                        {
                            type: 10,
                            name: 'winners',
                            description: `The new amount of winners.`,
                            required: false,
                        },
                    ]
                },
            ],
        });
    }
    async run(interaction, member, options, subOptions) {

        switch (interaction.data.options[0].name) {

            case "start": {
                console.log(`Giveaway beginning?`);


                break;
            }

            case "edit": {
                const messageID = subOptions.get('message-id');
                break;
            }
        }



    }

}
