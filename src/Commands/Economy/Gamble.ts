import Command from "../../Interfaces/Command";
import {promisify} from "util";
const wait = promisify(setTimeout);

export default class GambleCommand extends Command {
    constructor(client) {
        super(client, 'gamble', {
            description: "Gamble away all of your coins!",
            category: "Economy",
            guildOnly: true,
            options: [
                {
                    type: 1,
                    name: 'slots',
                    description: `Spin the wheel and hope for a match!`,
                    options: [
                        {
                            type: 10,
                            name: 'bet',
                            description: 'The bet you would like to place! (Default 1000)',
                            required: false,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'blackjack',
                    description: `See if you can beat vade at a game of blackjack!`,
                    options: [
                        {
                            type: 10,
                            name: 'bet',
                            description: 'The bet you would like to place! (Default 500)',
                            required: false,
                        }
                    ]
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const Profile = (await this.client.utils.getProfileSchema(member.id))!!;
        const checkPremium = await this.client.utils.checkPremium(interaction.guildID);
        const max = checkPremium ?  1000000 : 250000;
        const min = checkPremium ? 1000 : 2000;
        const bet = subOptions.get("bet") ?? min;
        const nf = new Intl.NumberFormat();
        switch(interaction.data.options[0].name) {

            case "slots": {
                if (!Profile.Wallet || Profile.Wallet < bet)
                    return interaction.createFollowup(`You don't have enough to play a game of slots.`);

                if (bet > max)
                    return interaction.createFollowup(`You cannot make a bet of over **${nf.format(max)}**!`);
                if (bet < min)
                    return interaction.createFollowup(`You need to make sure your bet is over **${nf.format(min)}**.`);

                const emojis: string[] = [
                    "🍋",
                    "🍎",
                    "🍇",
                    "🍀",
                    "💎",
                    "🍍",
                    "🍒",
                    "🍊",
                ];

                const slots = [];

                const embed = new this.client.embed()
                    .setDescription(`-- SPINNING --`)
                    .setTimestamp()
                    .setAuthor(`${member.username}#${member.discriminator}`, member.user.avatarURL)
                    .setFooter(`Velocity Economy System`);

                const gameMessage = await interaction.createFollowup({ embeds: [embed]});
                for (let i = 0; i < 3; i++) {
                    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                    slots.push(emoji);

                    embed.setDescription(slots.join("  |  "));

                    if (i !== 3) {
                        await wait(2000);
                    }
                    gameMessage.edit({ embeds: [embed] });
                }

                let profit = 0;
                if (slots[0] === slots[1] && slots[0] === slots[2]) {
                    profit = bet * 1.9;
                } else if (slots[0] === slots[1]) {
                    profit = bet * 1.3;
                } else if (slots[0] === slots[2]) {
                    profit = bet * 0.5;
                } else if(slots[1] === slots[2]) {
                    profit = bet * 0.5;
                }

                if (profit === 0) {
                    await Profile.updateOne({
                        $inc: { Wallet: -bet },
                    });
                } else {
                    await Profile.updateOne({
                        $inc: { Wallet: profit },
                    });
                }

                let amount = checkPremium ? profit * 1.35 : profit;
                const endEmbed = new this.client.embed()
                    .setDescription(
                        `Amount ${amount === 0 ? "lost" : "won"}: **${
                            amount === 0 ? `$${nf.format(bet)}` : `$${nf.format(profit)}`
                        }**`
                    )
                    .addField(
                        `New Balance`,
                        `$${nf.format(profit ? Profile.Wallet + profit : Profile.Wallet - bet)}`
                    )
                    .addField("\u200b", `>> ${slots.join("  |  ")} <<`);
                amount === 0
                    ? endEmbed.setColor('#F00000')
                    : endEmbed
                        .setColor(this.client.constants.colours.green)
                        .setAuthor(`${member.username}#${member.discriminator}`, member.avatarURL)
                        .setTimestamp()
                        .setFooter("Velocity Economy System");
                gameMessage.edit({ embeds: [endEmbed] });
                break;
            }

            case "blackjack": {
                interaction.createFollowup(`This subcommand is not complete.`);
                break;
            }

            default: {
                return;
            }

        }


    }

}
