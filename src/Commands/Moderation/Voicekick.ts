import Command from "../../Interfaces/Command";

export default class VoicekickCommand extends Command {
    constructor(client) {
        super(client, 'voicekick', {
            description: "Disconnect a member from their Voice Channel.",
            category: "Moderation",
            options: [
                {
                    name: `member`,
                    type: 6,
                    description: `The user to disconnect.`,
                    required: true,
                }
            ],
            botPerms: ['voiceMoveMembers'],
            userPerms: ['voiceMoveMembers']
        });
    }
    async run(interaction, member) {

        const ID = interaction.data.options[0].value;
        const member1 = (await member.guild.getRESTMember(ID));
        if(!member1) {
            return interaction.createFollowup(`Something seems to have gone wrong.. please try again.`);
        }
        if(!member1.voiceState?.channelID) {
            return interaction.createFollowup(`The member doesn't seem to be in a Voice Channel.`);
        }
        try {
            member1.edit({
                channelID: null,
            });

            return interaction.createFollowup(`Successfully disconnected that member from their Voice Channnel.`);
        } catch (e) {
            return interaction.createFollowup(`Something seems to have gone wrong.. please try again.`);
        }





    }

}
