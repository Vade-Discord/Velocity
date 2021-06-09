import Command from "../../Interfaces/Command";
import fetch from 'node-fetch';

export default class FoodCommand extends Command {
    constructor(client) {
        super(client, 'food', {
            aliases: ["foodporn"],
            description: "View a glorious image of some food!",
            category: "Fun",
        });
    }
    async run(message, args) {


        try {
            const data = await fetch("https://www.reddit.com/r/food/random/.json").then((res) =>
                res.json(),
            );

            const [children] = data[0].data.children;
            const permaLink = children.data.permalink;
            const url = `https://reddit.com${permaLink}`;
            const image = children.data.url;
            const title = children.data.title;
            const upvotes = children.data.ups;
            const comments = children.data.num_comments;

            const embed = new this.client.embed()
                .setTitle(title)
                .setURL(url)
                .setImage(image)
                .setFooter(`👍: ${upvotes} -  💬: ${comments}`);

            return message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});
        } catch (err) {
            return message.channel.createMessage({ content: `An unknown error has occured.`, messageReference: { messageID: message.id }});
        }


     }

    }
