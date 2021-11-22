import Command from "../../Interfaces/Command";

const options: {
    [flag: string]: {
        alias: string;
        message: string;
    };
} = {
    "--name": {
        alias: "-n",
        message: "Kicks all users whose name has the specified word in",
    },
    "--regex": {
        alias: "-r",
        message: "Kicks all users whose name match the regex",
    },
    "--silent": {
        alias: "-s",
        message: "Kicks users silently; does not DM them or displays output",
    },
    "--soft": {
        alias: "-S",
        message: "Kicks users and clears their messages",
    },
    "--hard": {
        alias: "-H",
        message: "Kicks users and appends your custom message to the DM",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not kick",
    },
};


export default class BanCommand extends Command {
    constructor(client) {
        super(client, 'ban', {
            aliases: [""],
            description: "Ban a user.",
            category: "Moderation",
            userPerms: ['banMembers'],
            botPerms: ['banMembers', "manageChannels"],
            guildOnly: true,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: `The user to ban.`,
                    required: true,
                },
                {
                    type: 3,
                    name: 'reason',
                    description: `The reason for banning the user.`,
                    required: false,
                },
                {
                    type: 3,
                    name: 'options',
                    description: `the flags you want to apply to the ban.`,
                    required: false,
                },
            ],
            modCommand: true,
        });
    }
    async run(interaction, member, options, subOptions) {

        let rolesHigher = false;
        const getFlags = this.client.utils.getFlags;

        //const flags = getFlags(options.get("options"));

        //const booleanFlags = new Set(
            //flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        //);

        const banMember = (await member.guild.getMember(options.get("user")))!!;
        if (banMember &&
            banMember.id !== this.client.user?.id &&
            banMember.id !== member.id) {
            const hierarchy = await this.client.utils.roleHierarchy(interaction.guildID, interaction.member.id, banMember.id)
            const botHierarchy = await this.client.utils.roleHierarchy(interaction.guildID, this.client.user.id, banMember.id)
            if (!hierarchy) {
                return interaction.createFollowup(`Could not ban ${banMember.user.username}#${banMember.user.discriminator} due to them having a higher role than you.`);
            }
            if (!botHierarchy) {
                return interaction.createFollowup(`Could not ban ${banMember.user.username}#${banMember.user.discriminator} due to them having a higher role then me.`);
            }
        } else if (banMember.id === member.id) {
            return interaction.createFollowup(`You cannot ban yourself.`);
        } else if (banMember.id === member.id) {
            return interaction.createFollowup(`You cannot ban the bot with the bot.`);
        } else {
            return interaction.createFollowup(`Could not get the user to ban.`);
        }

        const reason = options.get("reason") || `${member.user.username}#${member.user.discriminator} ran the ban command.`

        const channel = await banMember.user.getDMChannel()

        let dmed = false

        if(options.has("options")) {
            const o = options.get("options");
            const flags = getFlags([o]);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(
                flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
            );

            for (const { flag, index } of flags) {
                switch(flag) {
                    case "s":
                    case "soft": {
                        await banMember.ban(7, reason).then(() => {
                            member.guild.unbanMember(banMember.id, reason);
                        });
                        await channel.createMessage(`You have been soft-banned from **${member.guild.name}**\nfor the reason:${reason.slice(0, 2000)}`).then(() => dmed = true).catch(() => null)
                        return interaction.createFollowup(`Successfully soft-banned **${banMember.username}#${banMember.discriminator}**.`);
                    }

                }
            }



        }

        await channel.createMessage(`You have been banned from ${interaction.channel.guild.name}\nfor the reason:${reason.slice(0, 2000)}`).then(() => dmed = true).catch((err) => { })
        await banMember.ban(7, reason)        

        //if (booleanFlags.has("-s")) return;

        let embed = new this.client.embed()
            .setTitle(`Banned ${banMember.user.username}#${banMember.user.discriminator}`)
            .addField("Reason", `\`${reason}\``)

            if(dmed) {
                embed.setDescription("Could not dm")
            } else {
                embed.setDescription("Dm sent successfully")
            }

        return interaction.createFollowup({embeds: 
            [embed]
                });

    }

}
