import Command from "../../Interfaces/Command";

export default class UpdateCommand extends Command {
    constructor(client) {
        super(client, 'update', {
            description: "Update a member to match the guilds configuration.",
            category: "Moderation",
            modCommand: true,
            userPerms: ['manageMembers'],
            botPerms: ['manageNicknames', 'manageRoles'],
            contextUserMenu: true,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'The user to update.',
                    required: true
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const u = options.get("user") ?? interaction.data?.target_id;
        const user = (await member.guild.getMember(u))!!;

        const guildData = (await this.client.utils.getGuildSchema(member.guild))!!;
        if(guildData?.nicknameFormat && user.id !== member.guild.ownerID) {

            const formatted = await this.client.utils.Interpolate(guildData.nicknameFormat, {
                username: `${user.username}`,
                tag: `${user.username}#${user.discriminator}`,
                id: `${user.id}`,
                guildName: `${user.guild.name}`,
                guildID: `${user.guild.id}`,
                highestRole: `${this.client.utils.getHighestRole(user, member.guild)?.name ?? 'No Role'}`,
                wallet: `$${(await this.client.utils.getProfileSchema(user.id))?.Wallet ?? 0}`,
                bank: `$${(await this.client.utils.getProfileSchema(user.id))?.Bank ?? 0}`,
            }).catch(() => null);

            let result;

            if(formatted?.length > 32) {
                result = formatted.slice(0, 31);
            } else {
                result = formatted;
            }

            if(user?.nick ? user.nick !== result : user.username !== result) {
                user.edit({ nick: result }).catch(() => null);
            }

        }

        interaction.createFollowup(`Successfully updated that member!`);

    }

    }