import Command from "../../Interfaces/Command";
import fetch from 'node-fetch';

export default class FoodCommand extends Command {
    constructor(client) {
        super(client, 'food', {
            description: "View a glorious image of some food!",
            category: "Fun",
        });
    }
    async run(interaction, member) {

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



            return interaction.createFollowup({
                embeds: [new this.client.embed()
                    .setTitle(title)
                    .setURL(url)
                    .setDescription(
                        `👍: ${upvotes} -  💬: ${comments}`
                    )
                    .setImage(image)]

            });
        } catch (err) {
            return interaction.createFollowup({ content: `An unknown error has occured.` });
        }
    }

}