import Command from "../../Interfaces/Command";

export default class VoicekickCommand extends Command {
    constructor(client) {
        super(client, 'voice', {
            description: "Contains all voice-related commands.",
            category: "Moderation",
            guildOnly: true,
            options: [
                {
                    name: 'disconnect',
                    type: 1,
                    description: `Disconnect a member from their Voice Channel.`,
                    options: [
                        {
                            name: `member`,
                            type: 6,
                            description: `The user to disconnect.`,
                            required: true,
                        },
                    ]
                },
                {
                    name: 'move',
                    type: 1,
                    description: `Move a member to a new Voice Channel.`,
                    options: [
                        {
                            name: `member`,
                            type: 6,
                            description: `The user to move.`,
                            required: true,
                        },
                        {
                            name: `channel`,
                            type: 7,
                            description: `The channel to move them to.`,
                            required: true,
                        },
                    ]
                }
            ],
            modCommand: true,
            botPerms: ['voiceMoveMembers'],
            userPerms: ['voiceMoveMembers']
        });
    }
    async run(interaction, member, options, subOptions) {

        switch(interaction.data.options[0].name) {

            case "disconnect": {
                const ID = subOptions.get(`member`);
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

            case "move": {
                const ID = subOptions.get(`member`);
                const member1 = (await member.guild.getRESTMember(ID));
                if(!member1.voiceState?.channelID) {
                    return interaction.createFollowup(`The member doesn't seem to be in a Voice Channel.`);
                }
                const c = subOptions.get("channel");
                const channel = (await this.client.getRESTChannel(c));
                if(channel.type !== 2 && channel.type !== 13) {
                    return interaction.createFollowup(`Looks like the channel that you provided wasn't a Voice Channel... please try again.`);
                }

                try {
                    member1.edit({
                        channelID: c,
                    });
                    return interaction.createFollowup(`Successfully moved that member to ${channel.mention}`);
                } catch (e) {
                    return interaction.createFollowup(`Something seems to have gone wrong.. please try again.`);
                }

            }
        }





    }

}
