import Command from "../../Interfaces/Command";
import profileSchema from "../../Schemas/User Schemas/Profile";
import ms from "ms";

export default class RobCommand extends Command {
    constructor(client) {
        super(client, 'rob', {
            description: "Rob another member for a chance of getting their cash!",
            category: "Economy",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'The user you would like to rob.',
                    required: true,
                }
            ],
            guildOnly: true,
        });
    }
    async run(interaction, member, options) {
        const data = (await this.client.redis.get(`cooldowns.robbery.${member.id}`));
        if(data) {
            const cooldownEmbed = new this.client.embed()
                .setAuthor(`Cooldown!`, this.client.user.avatarURL)
                .setDescription(`You must wait **${ms(Math.ceil(data - Date.now()), { long: true })}** before attempting to rob someone again!`)
                .setColor("#F00000")
                .setTimestamp()
                .setFooter(`Velocity Economy`, this.client.user.avatarURL)

            return interaction.createFollowup({ embeds: [cooldownEmbed] });
        }

        const nf = new Intl.NumberFormat();

        const userID = options.get("user");
        const user = (await member.guild.getRESTMember(userID))!!;
        const Res = (await this.client.utils.getProfileSchema(userID));
        const isPassive = Res?.Passive;
        if(isPassive) {
            return interaction.createFollowup(`That user is currently in passive mode.`);
        }
        const authorRes = (await this.client.utils.getProfileSchema(member.id))!!;
        if(authorRes && authorRes?.Passive) {
            return interaction.createFollowup(`You cannot rob someone whilst in passive mode.`);
        }
        const userBal = authorRes?.Wallet ?? 0;
        const minimumAmount = 2000;
        if(userBal < minimumAmount) {
            return interaction.createFollowup(`You must have over **$${nf.format(minimumAmount)}** to rob someone.`);
        }
        const robberBal = Res?.Wallet ?? 0;
        if (robberBal <= 0 || robberBal < 2000) {
            return interaction.createFollowup(`The person you are trying to rob doesn't have at least **$${nf.format(minimumAmount)}**.`);
        }
        const checkPremium = (await this.client.utils.checkPremium(interaction.guildID));
        const successRate = checkPremium
            ? Math.floor(Math.random() * 100)
            : Math.floor(Math.random() * 80) * 1.35;
        let a;
        let b = false;
        const func =
            successRate >= 55
                ? async () => {
                    const available = authorRes?.Wallet / 3;
                    const stealAmount = Math.floor(
                        Math.random() * (available - 2000) + 2000
                    );
                    a = stealAmount;
                    b = true;
                    await this.client.utils.changeCash(Res, stealAmount, 'wallet', true);
                    await this.client.utils.changeCash(authorRes, stealAmount);
                    return `Rob successful! You stole a grand total of **$${nf.format(
                        stealAmount
                    )}**`;
                }
                : async () => {
                    const available = Math.ceil(robberBal / 3);
                    const fine = Math.floor(Math.random() * (available - 2000) + 2000);
                    await this.client.utils.changeCash(authorRes, fine, 'wallet', true);
                    return `Rob failed! You were caught by the police and fined **$${nf.format(
                        fine
                    )}**`;
                }
        const embed = new this.client.embed()
            .setDescription(await func())
            .setAuthor(
                `${member.username}#${member.discriminator}`,
                member.avatarURL)
            .setFooter("Velocity Economy System")
            .setColor(b ? this.client.constants.colours.green : "#F00000")
            .setTimestamp();

        if(b) {
            await this.client.redis.set(`cooldowns.robbery.${member.id}`, Date.now() + ms("5m"), 'EX', ms("5m") / 1000 ) ;
        } else {
            await this.client.redis.set(`cooldowns.robbery.${member.id}`, Date.now() + ms("20s"), 'EX', ms("30s") / 1000 ) ;
        }

        if(b && Res?.Notifications?.robbery) {
            const gotRobbed = new this.client.embed()
                .setAuthor(`You got robbed!`, this.client.user.avatarURL)
                .setDescription(`${member.username}#${member.discriminator} stole **$${nf.format(a)}** from you!`)
                .setThumbnail(this.client.user.avatarURL)
                .setColor('#F00000')

            user.user.getDMChannel().then((channel) => {
                channel.createMessage({ embeds: [gotRobbed] }).catch(() => null);
            });
        }

        interaction.createFollowup({ embeds: [embed] });
    }
}
