import Command from "../../Interfaces/Command";

export default class RollCommand extends Command {
    constructor(client) {
        super(client, 'roll', {
            aliases: ["diceroll", "dice"],
            description: "Roll a dice!",
            category: "Fun",
        });
    }
    async run(message, args) {
        let roll = Math.floor(Math.random() * 6) + 1;
       await message.channel.createMessage({ content: `You rolled a ${roll}!`, messageReference: { messageID: message.id }});

     }

    }
