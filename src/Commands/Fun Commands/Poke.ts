import Command from "../../Interfaces/Command";
import fetch from 'node-fetch';

export default class PokeCommand extends Command {
    constructor(client) {
        super(client, 'poke', {
            aliases: ["nudge"],
            description: "Poke someone.",
            category: "Fun",
        });
    }
    async run(message, args) {

        try {
            const data = await fetch("https://nekos.life/api/v2/img/poke").then((res) => res.json());
            const member = await this.client.utils.getMember(message, args[0]);
            if(!member) return;
            const user = member?.user;
            const poked = message.author.id === user.id ? "themselves" : user.username;

            const embed = new this.client.embed()
                .setTitle(`${message.author.username} poked ${poked}`)
                .setDescription(`[Click to view](${data.url})`)
                .setImage(`${data.url}`);

            return message.channel.createMessage({embed: embed, messageReference: { messageID: message.id }});
        } catch (err) {
            console.log(err)
            return message.channel.createMessage({content: `An unknown error has occured.`, messageReference: { messageID: message.id }});
        }


     }

    }
