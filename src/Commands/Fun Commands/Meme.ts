import Command from "../../Interfaces/Command";
import * as api from "imageapi.js";

export default class MemeCommand extends Command {
    constructor(client) {
        super(client, 'meme', {
            aliases: ["getmeme"],
            description: "View a meme!",
            category: "Fun",
        });
    }
    async run(message, args) {

        try {
            const meme = await api.advanced("meme", "top");
            message.channel.createMessage({
                embed: new this.client.embed()
                    .setTitle(meme.title)
                    .setDescription(
                        `${meme.upvoteRatio}% of people liked this meme. :thumbsup: ${meme.upvotes} :thumbsdown: ${meme.downvotes}`
                    )
                    .setImage(meme.img), messageReference: { messageID: message.id }
            });
        } catch (e) {
            console.log(e)
            return message.channel.createMessage({ content: `An unknown error has occured.`, messageReference: { messageID: message.id }});
        }


     }

    }
