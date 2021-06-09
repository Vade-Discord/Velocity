import Command from "../../Interfaces/Command";
import giveMeAJoke from 'give-me-a-joke';

export default class DadjokeCommand extends Command {
    constructor(client) {
        super(client, 'dadjoke', {
            description: "Receive a random dad joke!",
            category: "Fun",
        });
    }
    async run(message, args) {
        try {
            let test;
                giveMeAJoke.getRandomDadJoke(function (joke) {
                    message.channel.createMessage({ content: joke, messageReference: { messageID: message.id }})
                });
        } catch (e) {
            console.log(e)
            message.channel.createMessage({ content: `An unknown error has occured.`, messageReference: { messageID: message.id }});
        }



     }

    }
