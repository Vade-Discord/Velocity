import Command from "../../Interfaces/Command";

export default class SusCommand extends Command {
    constructor(client) {
        super(client, 'sus', {
            aliases: ["susify"],
            description: "Generate a 'sus' image.",
            category: "Fun",
        });
    }
    async run(message, args) {

        const embed = new this.client.embed()
            .setColor(303136)
            .setDescription(
                ":black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square:\n:black_large_square::red_square::red_square::red_square::black_large_square::white_large_square::black_large_square::black_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::black_large_square::black_large_square:\n:black_large_square::red_square::blue_square::blue_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square:\n:black_large_square::red_square::red_square::red_square::black_large_square::black_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::white_large_square::black_large_square::black_large_square::black_large_square::white_large_square::black_large_square:\n:black_large_square::red_square::black_large_square::red_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square::white_large_square::white_large_square::white_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:"
            );

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});


     }

    }
