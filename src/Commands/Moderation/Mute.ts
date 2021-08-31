import Command from "../../Interfaces/Command";
import ms from 'ms';

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
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const member1 = (await member.guild.getRESTMember(options.get("member")))!!;
        console.log(member1);
        const time = ms(options.get("duration"));
        if(!time) {
            return interaction.createFollowup('You need to provide a valid time. (Example: "1d")');
        }

        // Check role hierarchy

        let muteRole;
        const mutedRole = member.guild.roles.find((m) => m.name.toLowerCase() === 'muted');
        if(!mutedRole) {
            muteRole = (await member.guild.createRole({
                name: 'Muted',
                permissions: 0,
                mentionable: false,
            }));
        } else {
            muteRole = mutedRole;
        }

        






    }

}
