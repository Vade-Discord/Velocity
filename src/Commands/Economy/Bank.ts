import Command from "../../Interfaces/Command";
import Eris from "eris";

export default class BankCommand extends Command {
    constructor(client) {
        super(client, 'bank', {
            aliases: [""],
            description: "Bank commands.",
            category: "Economy",
            options: [
                {
                    type: 1,
                    name: 'balance',
                    description: `View either your own or another users balance.`,
                    options: [
                        {
                            type: 6,
                            name: 'user',
                            description: `The user to get the balance of.`,
                            required: false,
                        },
                    ],
                },
                {
                    type: 1,
                    name: 'deposit',
                    description: `Deposit money from your Wallet into your Bank.`,
                    options: [
                        {
                            type: 10,
                            name: 'amount',
                            description: `The amount to deposit.`,
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: 'withdraw',
                    description: `Withdraw money from your Bank into your Wallet.`,
                    options: [
                        {
                            type: 10,
                            name: 'amount',
                            description: `The amount to withdraw.`,
                            required: true,
                        },
                    ],
                },
            ],
        });
    }
    async run(interaction, member, options, subOptions) {

        switch (interaction.data.options[0].name) {

            case "balance": {
                let user = member;
                const nf = Intl.NumberFormat();
                const ID = subOptions.get("user");
                if (ID) user = (await member.guild.getRESTMember(ID));
                const Profile = (await this.client.utils.getProfileSchema(user.id))!!;

                const balanceEmbed = new this.client.embed()
                    .setTitle(`${user.user.username}#${user.user.discriminator}'s Balance`)
                    .setDescription(
                        `Wallet: ${nf.format((Profile as any)?.Wallet) ?? 0}\nBank: ${nf.format((Profile as any)?.Bank) ?? 0
                        }`
                    )
                    .setColor(this.client.constants.colours.green)

                return interaction.createFollowup({ embeds: [balanceEmbed] });
            }

            case "deposit": {
                const amount = subOptions.get("amount");
                //if (!amount || isNaN(amount))
                //    return interaction.createFollowup(`You need to specify an amount to deposit.`);
                const Profile = (await this.client.utils.getProfileSchema(member.id))!!;
                if (!Profile || Profile.Wallet <= 0)
                    return interaction.createFollowup(`You have nothing in your Wallet to deposit.`);
                if (amount > Profile.Wallet)
                    return interaction.createFollowup(`You don't have enough to deposit.`);

                const nf = new Intl.NumberFormat();

                await Profile.updateOne({
                    $inc: { Bank: amount },
                });
                await Profile.updateOne({
                    $inc: { Wallet: -amount },
                });
                return interaction.createFollowup(`You have successfully deposited **${nf.format(amount)}**!`)
            }

            case "withdraw": {
                const amount = subOptions.get("amount");
                const Profile = (await this.client.utils.getProfileSchema(member.id))!!;
                if (!Profile || Profile.Bank < amount)
                    return interaction.createFollowup(`You don't have enough to withdraw.`);

                await Profile.updateOne({
                    $inc: { Bank: -amount },
                });
                await Profile.updateOne({
                    $inc: { Wallet: amount },
                });
                const nf = Intl.NumberFormat();
                return interaction.createFollowup(`Successfully withdrawn **${nf.format(amount)}**!`);
            }

        }

    }

}
