import Command from "../../Interfaces/Command";
import { createPaginationEmbed } from "../../Classes/Pagination";

export default class QueueCommand extends Command {
    constructor(client) {
        super(client, 'queue', {
            aliases: ["q"],
            description: "View the queue for the current server.",
            category: "Music",
            guildOnly: true,
        });
    }
    async run(message, args) {

        const player = await this.client.manager.players.get(message.guild.id);
        if (!player)
        return message.channel.createMessage({ content: "There is nothing playing", messageReference: { messageID: message.id }});
        if (!player.queue.length)
        return message.channel.createMessage({ content:"There is nothing currently queued.", messageReference: { messageID: message.id }});

        const embeds = await generateQueueEmbed(this.client, message, player.queue);
        let embed = new this.client.embed();

        if (message.channel.id !== player.options.textChannel) {
            embed.setDescription("Queue was sent to the queue channel");
            message.channel.send(embed);
        }

        if (!isNaN(parseInt(args[0]))) {
            if (parseInt(args[0]) > embeds.length)
           return message.channel.createMessage({ content: `There are only ${embeds.length} page(s) of queue!`, messageReference: { messageID: message.id }});
        }

        return await createPaginationEmbed(message, embeds, {});

    }

    }
async function generateQueueEmbed(client, message, queue) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = await current
            .map(
                (track) =>
                    `**\`${++j}.\`**\`| [${client.utils.msConversion(track.duration)}]\` - [${
                        track.title
                    }](${track.uri})`
            )
            .join("\n");
        let totalDuration = 0;
        await queue.forEach((song) => {
            totalDuration = song.duration + totalDuration;
        });
        const embed = new client.embed()
            .setTitle("Song Queue\n")
            .setThumbnail(message.channel.guild.iconURL)
            .setDescription(
                `**Current Song - [${queue.current.title}](${queue.current.uri})**\n\n${info}`
            )
            .setFooter(
                `🎵 ${queue.length + 1}  •  🕒 ${client.utils.msConversion(totalDuration)}`
            );
        embeds.push(embed);
    }
    return embeds;
}