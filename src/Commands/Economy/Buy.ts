import Command from "../../Interfaces/Command";
import allItems from "../../Assets/Shop";
import { distance } from "fastest-levenshtein";

export default class BuyCommand extends Command {
    constructor(client) {
        super(client, 'buy', {
            description: "Purchase an item from the shop!",
            category: "Economy",
            options: [
                {
                    type: 3,
                    name: 'item',
                    description: 'The item that you would like to purchase.',
                    required: true,
                },
                {
                    type: 10,
                    name: 'amount',
                    description: 'The amount of items that you would like to purchase.',
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const item = options.get("item");
        const amount = options.get("amount") ?? 1;
        const located = allItems.find((i) => distance(i.name, item) < 2.5);
        if(!located) {
            return interaction.createFollowup('Unable to locate that item. Please try again.');
        }
        const itemPrice: number = located.price * amount;
        const profile = (await this.client.utils.getProfileSchema(member.id))!!;
        if(amount >= 100) {
            return interaction.createFollowup(`You cannot purchase more than 100 items at a time.`);
        }
        if(profile?.Wallet < itemPrice) {
            return interaction.createFollowup(`You do not currently have enough money in your wallet to make that purchase.`);
        }

        let check;
        if ("Inventory" in profile) {
            check = profile?.Inventory.find((x) => x.name === located.id)?.amount;
        }

        const object = {
            name: located.id,
            amount: check ? check + amount : amount,
        }


    }

}
