import Command from "../../Interfaces/Command";
import items from "../../Assets/Shop";
import { Paginate } from "@the-nerd-cave/paginate";
import { createPaginationEmbed } from "../../Classes/Pagination";

export default class InventoryCommand extends Command {
    constructor(client) {
        super(client, 'inventory', {
            description: "View either your own or another users inventory.",
            category: "Economy",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: `Who's inventory you would like to view.`,
                    required: false
                }
            ],
            contextUserMenu: true,
        });
    }
    async run(interaction, member, options) {

        const userID = interaction.data?.target_id ? interaction.data.target_id : options.get("user") ?? member.id;
        const userProfile = (await this.client.utils.getProfileSchema(userID))!!;
        const user = (await this.client.getRESTUser(userID));
        if(!userProfile?.Inventory) {
            return interaction.createFollowup('That user has nothing in their inventory.');
        }
        const sorted = userProfile.Inventory.sort((i, f) =>  items.find((e => i.name === e.id)).price - items.find((e) => f.name === e.id).price);
        const mapped = sorted.map((item) => {
         const e = items.find((e) => e.id?.toLowerCase() === item.name?.toLowerCase());
            return `${e.emoji} ${this.client.utils.capitalise(item.name)} (**${userProfile.Inventory.find((d) => e.id?.toLowerCase() === d.name?.toLowerCase()).amount}**)\n\n`
        });

        const pages = new Paginate(mapped, 6).getPaginatedArray();
        const embeds = pages.map((page, index) => {
            return new this.client.embed()
                .setTitle(`${user.username}#${user.discriminator}'s Inventory`)
                .setDescription(
                    page.join("\n") ??
                    `No more Items to be listed on page ${index + 1}`
                )
                .setTimestamp();
        });
        if(!embeds?.length) {
            return interaction.createFollowup(`${member.id === userID ? 'You have no items in your inventory.' : 'That user has no items in their inventotory.'}`);
        }
        if(embeds.length <= 1) {
            return interaction.createFollowup({ embeds: [embeds[0]] });
        } else {
            return await createPaginationEmbed(this.client, interaction, embeds, {});
        }



    }

}
