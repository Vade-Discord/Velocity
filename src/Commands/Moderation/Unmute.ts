import Command from "../../Interfaces/Command";
import mutedSchema from "../../Schemas/Backend/Muted";

export default class UnmuteCommand extends Command {
    constructor(client) {
        super(client, 'unmute', {
            description: "Remove a mute for a member.",
            category: "Moderation",
            modCommand: true,
            userPerms: ['manageMessages', 'manageRoles'],
            botPerms: ['manageRoles'],
            guildOnly: true,
            options: [
                {
                    type: 6,
                    name: 'member',
                    description: 'The member you would like to unmute.',
                    required: true
                },
            ]
        });
    }
    async run(interaction, member, options, subOptions) {



        const member1 = (await member.guild.getMember(options.get("member")))!!;
        if(!(await this.client.redis.get(`mute.${member1.id}.${interaction.guildID}`))) {
            return interaction.createFollowup(`That member doesn't seem to be muted.`);
        }
        const botHierarchy = (await this.client.utils.roleHierarchy(interaction.guildID, this.client.user.id, member1.id));
        if(!botHierarchy) {
            return interaction.createFollowup({ content: `I am unable to removed the mute for that member, my highest role is lower than their highest role.`, flags: silent });
        }
        const hierarchy = (await this.client.utils.roleHierarchy(interaction.guildID, member.id, member1.id));
        if(!hierarchy) {
            return interaction.createFollowup({ content: `You cannot un-mute someone with a higher role than you.` });
        }

        await this.client.redis.del(`mute.${member1.id}.${interaction.guildID}`);
        const schema = (await mutedSchema.findOne({ userID: member1.id, guildID: interaction.guildID }));
        if(schema) {
            await this.client.utils.muteEnded(schema, false);
        } else {
            return interaction.createFollowup(`That member doesn't seem to be muted.`);
        }

        interaction.createFollowup({ content: `Successfully un-muted that member!` });
        const logChannel = await this.client.utils.loggingChannel(member.guild, 'moderation');
        const embed = new this.client.embed()
            .setAuthor(`${member1.username}#${member1.discriminator}`, member1.user.avatarURL)
            .setTitle(`${this.client.constants.emojis.moderation.mention} Member Force-Unmuted`)
            .setDescription(`**Member:** ${member1.mention}\n**Moderator:** ${member.mention}`)
            .setColor(this.client.constants.colours.green)
            .setThumbnail(member1.user.avatarURL)
            .setFooter(`Velocity Logging System`)
            .setTimestamp()

        logChannel?.createMessage({embeds: [embed]});


    }

}
