import Command from "../../Interfaces/Command";
import allItems from "../../Assets/Shop";
import { distance } from "fastest-levenshtein";

export default class BuyCommand extends Command {
    constructor(client) {
        super(client, 'buy', {
            description: "Purchase an item from the shop! Purchase between 1 and 100!",
            category: "Economy",
            options: [
                {
                    type: 3,
                    name: 'item',
                    description: 'The item that you would like to purchase.',
                    required: true,
                    autocomplete: true
                },
                {
                    type: 10,
                    name: 'amount',
                    description: 'The amount of items that you would like to purchase. (Between 1 and 100)',
                    min_value: 1,
                    max_value: 100
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const item = options.get("item");
        const amount: number = options.get("amount") ?? 1;
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

        const alreadyHas = profile?.Inventory.findIndex((x => x.name === located.id));
        if(alreadyHas !== -1) {

            await profile.updateOne({
                $inc: { Wallet: -itemPrice },
                $set: { [`Inventory.${alreadyHas}.amount`] : check + amount }
            });
        } else {
            await profile.updateOne({
                $inc: { Wallet: -itemPrice },
                $push: { Inventory: object }
            });
        }
const nf = new Intl.NumberFormat();
        interaction.createFollowup(`You have successfully purchased **${amount} ${located.name}${amount > 1 ? 's' : ''}** for a total of **$${nf.format(itemPrice)}**.`);


    }

    async autocomplete(interaction, options) {
        const [focused] = options.filter((option) => option.focused === true)
        const result = []

        if(focused) {
            let items = await allItems
                .filter((item) => item.name.startsWith(focused.value))
                .sort(
                    (a, b) => 
                        (a.name > b.name) ? 1 :
                                -1
                )

                items.forEach((item) => {
                return result.push({
                    name: item.name,
                    value: item.name
                })
            })

        }

        if(result.length >= 26) result.length = 25
            
        if(!result[0]) result[0] = {
            name: `No Options Avalible`,
            value: `none`
        }

        return interaction.result(result)
    }

}
