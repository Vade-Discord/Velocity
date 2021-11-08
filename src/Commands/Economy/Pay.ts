import Command from "../../Interfaces/Command";

export default class PayCommand extends Command {
    constructor(client) {
        super(client, 'pay', {
            description: "Send another member cash from your wallet.",
            category: "Economy",
            guildOnly: true,
            options: [
                {
                    type: 6,
                    name: 'member',
                    description: 'The member who you would like to give the cash to.',
                    required: true
                },
                {
                    type: 10,
                    name: 'amount',
                    description: 'How much do you want to give them?',
                    required: true
                }
            ]
        });
    }
    async run(interaction, member, options) {

        const authorData = (await this.client.utils.getProfileSchema(member.id))!!;
        const toPay = (await this.client.utils.getProfileSchema(options.get("member")))!!;
        const amountToPay = options.get("amount");
        const amount = Math.ceil(amountToPay);
        const user = (await member.guild.getRESTMember(options.get("member")))!!;
        if(authorData?.Wallet < amount) {
            return interaction.createFollowup(`You don't have enough to give them that amount.`);
        }
        if(user.id === member.id) {
            return interaction.createFollowup(`You cannot send money to yourself.`);
        }

        await this.client.utils.changeCash(authorData, amount, 'wallet', true);
        await this.client.utils.changeCash(toPay, amount);

        const nf = new Intl.NumberFormat();

        interaction.createFollowup(`Successfully sent **$${nf.format(amount)}** to **${user.username}#${user.discriminator}**.`);
        if(toPay?.Notifications?.economy) {
            const channel = (await user.user.getDMChannel());
            const paidEmbed = new this.client.embed()
                .setAuthor(`Money Received!`, user.avatarURL)
                .setDescription(`**${member.username}#${member.discriminator}** has sent you **$${nf.format(amount)}**!`)
                .setColor(this.client.constants.colours.green)
                .setTimestamp()
                .setFooter(`Disable these notifications via /notifications`, this.client.user.avatarURL);
            channel.createMessage({
                embeds: [paidEmbed]
            }).catch(() => null)
        }

    }

}
