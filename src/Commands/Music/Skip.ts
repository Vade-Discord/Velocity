import Command from "../../Interfaces/Command";

export default class SkipCommand extends Command {
    constructor(client) {
        super(client, 'skip', {
            description: "Skip a song or a certain amount of songs.",
            category: "Music",
            options: [
                {
                    name: `amount`,
                    description: `The amount of songs to skip.`,
                    required: false,
                    type: 10
                }
            ]
        });
    }
    async run(interaction, member) {

        const player = this.client.manager.players.get(interaction.guildID);
        if(!player || !player.playing) {
            return interaction.createFollowup(`There doesn't seem to be anything playing.`);
        }
        const amount = interaction.data.options[0].value;
        if(amount) {
            // They specified an amount.

        }

     }

    }
