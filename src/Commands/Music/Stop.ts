import Command from "../../Interfaces/Command";

export default class DisconnectCommand extends Command {
    constructor(client) {
        super(client, 'disconnect', {
            description: "Stop the music from playing. Disconnects the bot from the VC.",
            category: "Music",
        });
    }
    async run(interaction, member, options, subOptions) {

        const player = this.client.manager.players.get(interaction.guildID);
        const voiceState = member.voiceState;
        const me = member.guild.members.get(this.client.user.id);
        if(!me.voiceState || !me.voiceState.channelID) {
            return interaction.createFollowup(`I am not connected to a Voice Channnel!`);
        }
        if(player) {
            if(!voiceState || voiceState.channelID !== player.voiceChannel) {
                return interaction.createFollowup(`You must be in the same Voice Channel as me to use this Command!`);
            }
            player.destroy();
            const channel = member.guild.channels.get(player.voiceChannel);
            let embed = new this.client.embed()
                .setDescription(`${member.mention} ⏹ stopped the music!`);
            return interaction.createFollowup({ embeds: [embed] });
        }
        if(!voiceState || voiceState.channelID !== me.voiceState.channelID) {
            return interaction.createFollowup(`You must be in the same Voice Channel as me to use this Command!`);
        }
        const channel = member.guild.channels.get(me.voiceState.channelID);
        channel.leave();
        return interaction.createFollowup(`Successfully disconnected!`);

    }

    }