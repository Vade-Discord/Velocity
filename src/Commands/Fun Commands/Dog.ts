import Command from "../../Interfaces/Command";
import superagent from "superagent";

export default class DogCommand extends Command {
    constructor(client) {
        super(client, 'dog', {
            aliases: ["doggo", "dogimage"],
            description: "View an image of a Dog!",
            category: "Fun",
        });
    }
    async run(message, args) {


        try {

            let { body } = await superagent.get(`https://random.dog/woof.json`);

            let dogEmbed = new this.client.embed()
                .setTitle(`Dog Image`)
                .setImage(body.url)

            message.channel.createMessage({ embed: dogEmbed, messageReference: { messageID: message.id }});
        } catch (e) {
            console.log(e)
           return message.channel.createMessage({ content: `There was an error whilst searching.`, messageReference: { messageID: message.id }});
        }


    }

    }
