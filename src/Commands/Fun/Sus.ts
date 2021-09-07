import Command from "../../Interfaces/Command";

export default class SusCommand extends Command {
    constructor(client) {
        super(client, 'sus', {
            description: "Sus...",
            category: "Fun",
        });
    }
    async run(interaction, member) {

        const embed = new this.client.embed()
            .setColor(303136)
            .setDescription(
                ":black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square:\n:black_large_square::red_square::red_square::red_square::black_large_square::white_large_square::black_large_square::black_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::black_large_square::black_large_square:\n:black_large_square::red_square::blue_square::blue_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square:\n:black_large_square::red_square::red_square::red_square::black_large_square::black_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::black_large_square::black_large_square::white_large_square::black_large_square:\n:black_large_square::red_square::black_large_square::red_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:"
            );

        interaction.createFollowup({ embeds: [embed] });

    }

}
