import Command from "../../Interfaces/Command";
import profileSchema from "../../Schemas/User Schemas/Profile";
import ms from 'ms';
import Eris from "eris";

export default class RedeemCommand extends Command {
    constructor(client) {
        super(client, 'redeem', {
            aliases: [""],
            description: "Redeem commands.",
            category: "Economy",
            guildOnly: true,
            options: [
                {
                    type: 1,
                    name: 'hourly',
                    description: `Claim your hourly allowance.`,
                },
                {
                    type: 1,
                    name: 'daily',
                    description: `Claim your daily allowance.`,
                },
                {
                    type: 1,
                    name: 'weekly',
                    description: `Claim your weekly allowance.`,
                },
            ],
        });
    }
    async run(interaction, member, options, subOptions) {

        switch (interaction.data.options[0].name) {

            case "hourly": {
                const Profile = (await this.client.utils.getProfileSchema(member.user.id))!!;
                if (
                    !(Profile as any)?.HourlyTime ||
                    Date.now() > (Profile as any).HourlyTime
                ) {
                    if (Profile)
                        await Profile.updateOne({
                            $inc: { Wallet: 1000 },
                            HourlyTime: Date.now() + ms("1h"),
                        });

                    const hourlyEmbed = new this.client.embed()
                        .setTitle("Success!")
                        .setDescription(`I have given you your 1,000 Hourly Coins!`)

                    return interaction.createFollowup({ embeds: [hourlyEmbed] });
                } else {

                    const hourlyEmbed = new this.client.embed().setDescription(
                        `You can use this Command again in ${ms(
                            (Profile as any).DailyTime - Date.now(),
                            { long: true }
                        )}`
                    )
                    return interaction.createFollowup({ embeds: [hourlyEmbed] });
                }
            }

            case "daily": {
             const Profile = (await this.client.utils.getProfileSchema(member.user.id))!!; 
                if (
                    !(Profile as any)?.DailyTime ||
                    Date.now() > (Profile as any).DailyTime
                ) {
                    if (Profile)
                        await Profile.updateOne({
                            $inc: { Wallet: 2500 },
                            DailyTime: Date.now() + ms("1d"),
                        });

                    const dailyEmbed = new this.client.embed()
                        .setTitle("Success!")
                        .setDescription(`I have given you your 2,500 Daily Coins!`)

                    return interaction.createFollowup({ embeds: [dailyEmbed] });
                } else {

                    const dailyEmbed = new this.client.embed().setDescription(
                        `You can use this Command again in ${ms(
                            (Profile as any).DailyTime - Date.now(),
                            { long: true }
                        )}`
                    )
                    return interaction.createFollowup({ embeds: [dailyEmbed] });
                }
            }

            case "weekly": {
                const Profile = (await this.client.utils.getProfileSchema(member.user.id))!!;
                if (
                    !(Profile as any)?.WeeklyTime ||
                    Date.now() > (Profile as any).WeeklyTime
                ) {
                    if (Profile)
                        await Profile.updateOne({
                            $inc: { Wallet: 25000 },
                            WeeklyTime: Date.now() + ms("7d"),
                        });

                    const weeklyEmbed = new this.client.embed()
                        .setTitle("Success!")
                        .setDescription(`I have given you your 25,000 Weekly Coins!`)

                    return interaction.createFollowup({ embeds: [weeklyEmbed] });
                } else {

                    const weeklyEmbed = new this.client.embed().setDescription(
                        `You can use this Command again in ${ms(
                            (Profile as any).WeeklyTime - Date.now(), { long: true })}`)

                    return interaction.createFollowup({ embeds: [weeklyEmbed] });

                        
                }
            }

            default: {
                return;
            }

        }

    }

}
