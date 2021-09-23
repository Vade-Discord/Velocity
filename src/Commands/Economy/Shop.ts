import Command from "../../Interfaces/Command";
import allItems from "../../Assets/Shop";
import { Paginate } from "@the-nerd-cave/paginate";
import { createPaginationEmbed } from "../../Classes/Pagination";

export default class ShopCommand extends Command {
    constructor(client) {
        super(client, 'shop', {
            description: "View all of the available items!",
            category: "Economy",
        });
    }
    async run(interaction, member) {

        const mapped = allItems.map((i) => {
            return `${i.emoji} ${i.name}\n${i.description}\n\n`
        });


        // @ts-ignore
        const toPaginate = new Paginate(mapped, 8).getPaginatedArray();

        const embeds = toPaginate.map((page, index) => {
            return new this.client.embed()
                .setTitle(`Vade Economy | Shop`)
                .setDescription(
                    page.join("\n") ??
                    `No more Items to be listed on page ${index + 1}`
                )
                .setTimestamp();
        });

        if(embeds.length <= 1) {
            return interaction.createFollowup({ embeds: [embeds[0]]})
        } else {
            return await createPaginationEmbed(this.client, interaction, embeds, {});
        }


    }

}
