import Command from "../../Interfaces/Command";

const answers: string[] = [
    "Maybe.",
    "Certainly Not.",
    "I hope so.",
    "Not in your wildest dreams.",
    "There is a good chance.",
    "Quite likely.",
    "I think so.",
    "I hope so.",
    "I hope not.",
    "Never!",
    "Forget about it.",
    "Ahaha really!?",
    "Pfft.",
    "Sorry, bucko.",
    "Hell, yes.",
    "Hell to the no.",
    "The future is bleak.",
    "The future is uncertain.",
    "I would rather not say.",
    "Who cares?",
    "Possibly.",
    "Never, ever, ever.",
    "There is a small chance.",
    "Yes!",
];

export default class EightballCommand extends Command {
    constructor(client) {
        super(client, '8ball', {
            aliases: ["eightball"],
            description: "Have a question of your choice answered randomly!",
            category: "Fun",
        });
    }
    async run(message, question) {
        return message.channel.createMessage({
           content: question.join(" ").endsWith("?")
                ? `🎱 ${answers[Math.floor(Math.random() * answers.length)]}`
                : "🎱 That doesn't seem to be a question, please try again.", messageReference: { messageID: message.id }
        });


     }

    }
