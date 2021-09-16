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


export default class KickCommand extends Command {
    constructor(client) {
        super(client, 'kick', {
            aliases: [""],
            description: "Kick a user.",
            category: "Moderation",
            userPerms: ['kickMembers'],
            botPerms: ['kickMembers', "manageChannels"],
            guildOnly: true,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: `The user to kick.`,
                    required: true,
                },
                {
                    type: 3,
                    name: 'reason',
                    description: `The reason for kicking the user.`,
                    required: false,
                },
            ],
            modCommand: true,
        });
    }
    async run(interaction, member, options, subOptions) {

        let dmed = false;

        const kickMember = (await member.guild.getRESTMember(options.get("user")))!!;
        if (kickMember &&
            kickMember.id !== this.client.user?.id &&
            kickMember.id !== member.id) {
            const hierarchy = await this.client.utils.roleHierarchy(interaction.guildID, interaction.member.id, kickMember.id)
            const botHierarchy = await this.client.utils.roleHierarchy(interaction.guildID, this.client.user.id, kickMember.id)
            if (!hierarchy) {
                return interaction.createFollowup(`Could not kick ${kickMember.user.username}#${kickMember.user.discriminator} due to them having a higher role than you.`);
            }
            if (!botHierarchy) {
                return interaction.createFollowup(`Could not kick ${kickMember.user.username}#${kickMember.user.discriminator} due to them having a higher role then me.`);
            }
        } else if (kickMember.id === member.id) {
            return interaction.createFollowup(`You cannot kick yourself.`);
        } else if (kickMember.id === member.id) {
            return interaction.createFollowup(`You cannot kick the bot with the bot.`);
        } else {
            return interaction.createFollowup(`Could not get the user to kick.`);
        }

        const reason = options.get("reason") || `${member.user.username}#${member.user.discriminator} ran the kick command.`

        const channel = await kickMember.user.getDMChannel()

        await channel.createMessage(`You have been kicked from ${interaction.channel.guild.name}\nfor the reason:${reason.slice(0, 2000)}`).then(() => dmed = true).catch((err) => { })
        await kickMember.kick(reason);
        let embed = new this.client.embed()
            .setTitle(`Kicked ${kickMember.user.username}#${kickMember.user.discriminator}`)
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
