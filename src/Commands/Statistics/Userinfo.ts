import Command from "../../Interfaces/Command";
import {Constants} from "eris";
import moment from 'moment';

export default class UserinfoCommand extends Command {
    constructor(client) {
        super(client, 'userinfo', {
            aliases: [""],
            description: "Get information on a user!",
            category: "Statistics",
            guildOnly: true,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: `The user you would like to see the information of.`,
                    required: true,
                },
            ],
            contextUserMenu: true,
        });
    }
    async run(interaction, member, options) {

        const guild = this.client.guilds.get(interaction.guildID);
        const u = options.get("user") ?? interaction.data?.target_id;

        if(!u) {
            return interaction.createFollowup(`You need to provide a user.`);
        }

        const user = await this.client.getRESTUser(u);

       const e =  Object.keys(Constants.UserFlags).filter((v) => user.publicFlags & Constants.UserFlags[v])

    const m = await guild.getRESTMember(user.id);
    const memberRoles: Array<any> = m?.roles.length ? m.roles.map((m) => guild.roles.get(m)) : [];
        const flags = {
            DISCORD_EMPLOYEE: "Discord Employee",
            DISCORD_PARTNER: "Discord Partner",
            BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
            BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
            HYPESQUAD_EVENTS: "HypeSquad Events",
            HOUSE_BRAVERY: "House of Bravery",
            HOUSE_BRILLIANCE: "House of Brilliance",
            HOUSE_BALANCE: "House of Balance",
            EARLY_SUPPORTER: "Early Supporter",
            TEAM_USER: "Team User",
            SYSTEM: "System",
            VERIFIED_BOT: "Verified Bot",
            EARLY_VERIFIED_BOT_DEVELOPER: "Early Verified Bot Developer",
            VERIFIED_BOT_DEVELOPER: "Verified Bot Developer"
        }
        try {

            const embed = new this.client.embed()
                .setThumbnail(user.avatarURL)
                .setColor("BLUE")
                .addField("User",
                    `**❯** Username: **${user.username}**
                **❯** User Tag: **${user.discriminator}**
                **❯** Discord ID: **${user.id}**
                **❯** Flags: **${
                        e.length
                            ? e.map((flag) => flags[flag])?.join(", ")
                            : "None."
                    }**
                **❯** Avatar: **[Link to avatar](${user.dynamicAvatarURL(null, 512)})**
                **❯** Time Created:** ${moment(user.createdAt).format(
                        "LT"
                    )} ${moment(user.createdAt).format("LL")} ${moment(
                        user.createdAt
                    ).fromNow()}**
                **❯** Status: **${m.status ?? 'N/A'}**
                **❯** Game: **${m.activities?.length ? m.activities[0].name : "N/A"}**`
                )
                .addField("Member",
                    `
                    **❯** Server Join Date:** ${moment(m.joinedAt).format("LL LTS")}**
                **❯** Member Roles: **[${memberRoles?.length}]:**  ${
                    !memberRoles.length ? '**No roles**' :
                        memberRoles?.length < 10
                            ? memberRoles.map((m => m.mention))?.join(", ")
                            : memberRoles.length > 10
                                ? (this.client.utils.trimArray(memberRoles).map((r) => r.mention)
                                : "None"
                    }
                `
                );

            interaction.createFollowup({ embeds: [embed]});

        } catch (e) {
            console.log(e)
            return interaction.createFollowup(`Something went wrong when looking up that user.. please try again later.`);
        }

    }

}
