import Command from '../../Interfaces/Command';

export default class FilterCommand extends Command {
    constructor(client) {
        super(client, 'filter', {
            description: 'Apply a filter to the music!',
            category: 'Music',
            options: [
                {
                    type: 1,
                    name: 'nightcore',
                    description: 'Apply a nightcore effect to the music!',
                },
                {
                    type: 1,
                    name: 'karaoke',
                    description: 'Apply a karaoke effect to the music!',
                },
                {
                    type: 1,
                    name: 'pop',
                    description: 'Apply a pop effect to the music!',
                },
                {
                    type: 1,
                    name: 'soft',
                    description: 'Apply a soft effect to the music!',
                },
                {
                    type: 1,
                    name: 'vaporwave',
                    description: 'Apply a vaporwave effect to the music!',
                },
                {
                    type: 1,
                    name: 'eightd',
                    description: 'Apply an eightd effect to the music!',
                },
                {
                    type: 1,
                    name: 'tremelo',
                    description: 'Apply a tremelo effect to the music!',
                },
                {
                    type: 1,
                    name: 'vibrato',
                    description: 'Apply a vibrato effect to the music!',
                },
                {
                    type: 1,
                    name: 'reset',
                    description: 'Reset filter effects!',
                },
            ],
        });
    }
    async run(interaction, member, options, subOptions) {
        const player = this.client.manager.players.get(interaction.guildID);
        const voiceState = member.voiceState;

        const me = await member.guild.getRESTMember(this.client.user.id);
        if (!me.voiceState || !me.voiceState.channelID)
            return interaction.createFollowup(`I am not connected to a Voice Channnel!`);
        if (!voiceState || voiceState.channelID !== me.voiceState.channelID)
            return interaction.createFollowup(
                `You must be in the same Voice Channel as me to use this Command!`
            );
        if (!player) return interaction.createFollowup(`Nothing seems to be playing.`);

        let embed = new this.client.embed().setColor('#ffffff').setTimestamp();

        let choice = interaction.data.options[0].name;
        if (!choice) {
            embed.setDescription(`${member.mention} 🎵 You must specify a valid effect!`);
        } else if (choice === 'reset') {
            // @ts-ignore
            player.reset();
            embed.setDescription(`${member.mention} 🎵 **Reset** the filter effect!`);
        } else {
            if (choice === 'eightd') choice = 'eightD';
            player[choice] = true;
            embed.setDescription(`${member.mention} 🎵 **Enabled** ${choice}!`);
        }
        return interaction.createFollowup({ embeds: [embed] });
    }
}
