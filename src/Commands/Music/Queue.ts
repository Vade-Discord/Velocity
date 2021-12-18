import Command from "../../Interfaces/Command";
import {createPaginationEmbed} from "../../Classes/Pagination";

export default class QueueCommand extends Command {
    constructor(client) {
        super(client, 'queue', {
            description: "View the current queue.",
            category: "Music",
            guildOnly: true,
        });
    }
    async run(interaction, member, options, subOptions) {

        const player = this.client.manager.players.get(interaction.guildID);
        if(!player || !player.queue?.length) {
            return interaction.createMessage({ content: 'There is either nothing playing or there is nothing in the queue.', flags: 64 });
        }

        const queue = player.queue;

        const embeds = await generateQueueEmbed(this.client, member, queue);
        let embed = new this.client.embed();

        if(embeds?.length === 1) {
            return interaction.createMessage({ embeds: [embeds[0]], flags: 64})
        }

        return await createPaginationEmbed(this.client, interaction, embeds, { ephemeral: true });

    }

    }

async function generateQueueEmbed(client, member, queue) {
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
            .setThumbnail(member.guild.iconURL)
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