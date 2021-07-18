import Command from "../../Interfaces/Command";
import fetch from 'node-fetch';

export default class UrlCommand extends Command {
    constructor(client) {
        super(client, 'shortenurl', {
            aliases: ["shorturl"],
            description: "Make a URL smaller.",
            category: "Utility",
        });
    }
    async run(message, args) {

        const url = args.join(" ");
        if(!url.startsWith("http") || !url.startsWith("https")) {
        return message.channel.createMessage({ content: `You need to specify a valid URL.`, messageReference: { messageID: message.id }});
        }

        try {
            const data = await fetch(
                `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`
            ).then((res) => res.json());

            if(!data.shorturl) return message.channel.createMessage({ content: `An unknown error has occured...`, messageReference: { messageID: message.id }});

            message.channel.createMessage({ content: `Here's your URL: ${data.shorturl}`, messageReference: { messageID: message.id }});
        } catch (e) {
            console.log(e)
            return message.channel.createMessage({ content: `An unknown error has occured...`, messageReference: { messageID: message.id }});
        }




     }

    }
