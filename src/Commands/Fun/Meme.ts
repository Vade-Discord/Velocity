import Command from "../../Interfaces/Command";
import * as api from 'imageapi.js';

export default class MemeCommand extends Command {
    constructor(client) {
        super(client, 'meme', {
            description: "Recieve a meme!",
            category: "Fun",
        });
    }
    async run(interaction, member) {

        try {
            const meme = await api.advanced("meme", "top");
            interaction.createFollowup({
                embeds: [new this.client.embed()
                    .setTitle(meme.title)
                    .setDescription(
                        `${meme.upvoteRatio}% of people liked this meme. :thumbsup: ${meme.upvotes} :thumbsdown: ${meme.downvotes}`
                    )
                    .setImage(meme.img)]
            });
        } catch (e) {
            return interaction.createFollowup({ content: `An unknown error has occured.` });
        }

    }

}
