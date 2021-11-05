import Command from "../../Interfaces/Command";
import shopItems from "../../Assets/Shop";

export default class SellCommand extends Command {
    constructor(client) {
        super(client, 'sell', {
            description: "Sell an item from your Inventory!",
            category: "Economy",
            options: [
                {
                    type: 3,
                    name: 'item',
                    description: 'The item that you would like to sell.',
                    required: true,
                    autocomplete: true
                },
                {
                    type: 10,
                    name: 'amount',
                    description: 'How many of the item would you like to sell? (Between 1 and 50)',
                    min_value: 1,
                    max_value: 50
                }
            ]
        });
    }

    async run(interaction, member, options, subOptions) {

        const item = options.get("item");
        const amount = options.get("amount");
        const profile = (await this.client.utils.getProfileSchema(member.id))!!;
        // @ts-ignore
        if((profile.Inventory.filter((i) => i.name?.toLowerCase() === item?.toLowerCase())[0].amount <= amount)) {
            return interaction.createFollowup(`You do not have enough of that item to sell!`);
        }
        const itemInfo = (profile.Inventory.filter((i) => i.name === item))[0];
        // @ts-ignore
        const itemStoreInfo = shopItems.filter((i) => i.id?.toLowerCase() === itemInfo.name?.toLowerCase())[0];
        if(!itemStoreInfo) {
            return interaction.createFollowup('Something went wrong when searching for the item...');
        }
        const nf = new Intl.NumberFormat();
        const hasAmount = itemInfo.amount - amount;
        const object = {
            name: itemInfo.name,
            amount: hasAmount,
        }
        const deduction = (itemStoreInfo.price * amount) / 4 * 3;
        await profile.updateOne({
            $pull: { Inventory: itemInfo},
            $inc: { Wallet: deduction  }
        });
        await profile.updateOne({
            $push: { Inventory: object }
        });
        return interaction.createFollowup(`You successfully sold **${amount}** ${amount === 1 ? this.client.utils.capitalise(itemInfo.name) : `${this.client.utils.capitalise(itemInfo.name)}s`} for **$${nf.format(deduction)}**!`);




    }

    async autocomplete(interaction, options, member) {

        const [focused] = options.filter((option) => option.focused === true)
        const result = [];
        const profile = (await this.client.utils.getProfileSchema(member.id))!!;


        if(focused) {

            if(!("Inventory" in profile) || !profile.Inventory?.length) {
                result.push({
                    name: 'No items in Inventory.',
                    value: 'none'
                });

                return interaction.result(result);
            }
            const allItems = profile.Inventory;
            let items = allItems
                .filter((item) => item.name.toLowerCase().startsWith(focused.value.toLowerCase()))
                .sort(
                    (a, b) =>
                        (a.name > b.name) ? 1 :
                            -1
                )

            items.forEach((item) => {
                return result.push({
                    name: this.client.utils.capitalise(item.name),
                    value: item.name
                })
            })

        }

        if(result.length >= 26) result.length = 25

        if(!result[0]) result[0] = {
            name: `No Options Avalible`,
            value: `none`
        }

        return interaction.result(result);


        }



}