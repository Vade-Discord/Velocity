import Command from "../../Interfaces/Command";
import ms from 'ms';
import mutedSchema from "../../Schemas/Backend/Muted";
import {Constants} from "eris";

export default class MuteCommand extends Command {
    constructor(client) {
        super(client, 'mute', {
            description: "Mute a member with an optional reason.",
            category: "Moderation",
            modCommand: true,
            userPerms: ['manageMessages', 'manageRoles'],
            botPerms: ['manageRoles'],
            options: [
                {
                    type: 6,
                    name: 'member',
                    description: 'The member you would like to mute.',
                    required: true
                },
                {
                    type: 3,
                    name: 'duration',
                    description: 'How long the member should be muted for.',
                    required: true,
                },
                {
                    type: 3,
                    name: 'reason',
                    description: 'The reason for the mute.',
                    required: false,
                },
                {
                    type: 5,
                    name: 'silent',
                    description: 'Whether the success message should be sent publicly.',
                    required: false,
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const member1 = (await member.guild.getRESTMember(options.get("member")))!!;
        const silent = options.get("silent") ? 64 : 0;
        const reason = options.get("reason") ?? 'No reason provided.';
        console.log(silent)
        const time = ms(options.get("duration"));
        if(!time) {
            return interaction.createFollowup({ content: 'You need to provide a valid time. (Example: "1d")', flags: silent });
        }

        const botHierarchy = (await this.client.utils.roleHierarchy(interaction.guildID, this.client.user.id, member1.id));
        if(!botHierarchy) {
            return interaction.createFollowup({ content: `I am unable to mute that member, my highest role is lower than their highest role.`, flags: silent });
        }
        const hierarchy = (await this.client.utils.roleHierarchy(interaction.guildID, member.id, member1.id));
        if(!hierarchy) {
            return interaction.createFollowup({ content: `You cannot mute someone with a higher role than you.`, flags: silent });
        }

        let muteRole;
        const mutedRole = member.guild.roles.find((m) => m.name.toLowerCase() === 'muted');
        if(!mutedRole) {
            muteRole = (await member.guild.createRole({
                name: 'Muted',
                permissions: 0,
                mentionable: false,
            }));

            await member.guild.channels.forEach((channel) => {
                if(channel.permissionsOf(this.client.user.id).has("manageChannels")) {
                    channel.editPermission(muteRole.id, 0, Constants.Permissions.sendMessages | Constants.Permissions.voiceSpeak | Constants.Permissions.voiceRequestToSpeak | Constants.Permissions.sendTTSMessages, "role");

                }
            });
        } else {
            muteRole = mutedRole;
        }

        const newSchema = new mutedSchema({
            userID: member1.id,
            guildID: interaction.guildID,
            roles: member1.roles,
        });

        await newSchema.save();
        await this.client.redis.set(`mute.${member1.id}.${interaction.guildID}`, true, 'EX', Math.ceil(Math.floor(time / 1000)));

        await member1.edit({
            roles: [muteRole.id]
        });

        interaction.createFollowup({ content: `Successfully muted that member!`, flags: silent });
        const logChannel = await this.client.utils.loggingChannel(member.guild, 'moderation');
        const embed = new this.client.embed()
            .setAuthor(`${member1.username}#${member1.discriminator}`, member1.user.avatarURL)
            .setTitle(`${this.client.constants.emojis.moderation.mention} Member Muted`)
            .setDescription(`**Member:** ${member1.mention}\n**Moderator:** ${member.mention}\n**Reason:** "${reason}"`)
            .setColor('#F00000')
            .setThumbnail(member1.user.avatarURL)
            .setFooter(`Vade Logging System`)
            .setTimestamp()

        logChannel?.createMessage({embeds: [embed]});


    }

}
