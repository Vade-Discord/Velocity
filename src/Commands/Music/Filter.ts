import Command from "../../Interfaces/Command";

export default class FilterCommand extends Command {
    constructor(client) {
        super(client, 'filter', {
            description: "Apply a filter to the music!",
            category: "Music",
            options: [
                {
                    type: 1,
                    name: 'nightcore',
                    description: 'Apply a nightcore effect to the music!'
                },
                {
                    type: 1,
                    name: 'karaoke',
                    description: 'Apply a karaoke effect to the music!'
                },
                {
                    type: 1,
                    name: 'pop',
                    description: 'Apply a pop effect to the music!'
                },
                {
                    type: 1,
                    name: 'soft',
                    description: 'Apply a soft effect to the music!'
                },
                {
                    type: 1,
                    name: 'vaporwave',
                    description: 'Apply a vaporwave effect to the music!'
                },
                {
                    type: 1,
                    name: 'eightd',
                    description: 'Apply an eightd effect to the music!'
                },
                {
                    type: 1,
                    name: 'tremelo',
                    description: 'Apply a tremelo effect to the music!'
                },
                {
                    type: 1,
                    name: 'vibrato',
                    description: 'Apply a vibrato effect to the music!'
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const player = this.client.manager.players.get(interaction.guildID);
        const voiceState = member.voiceState;

        const me = (await member.guild.getRESTMember(this.client.user.id));
        if(!me.voiceState || !me.voiceState.channelID) return interaction.createFollowup(`I am not connected to a Voice Channnel!`);
        if(!voiceState || voiceState.channelID !== me.voiceState.channelID) return interaction.createFollowup(`You must be in the same Voice Channel as me to use this Command!`);
        if(!player) return interaction.createFollowup(`Nothing seems to be playing.`);

        let embed = new this.client.embed()
            .setColor('#ffffff')
            .setTimestamp();

        switch(interaction.data.options[0].name) {

            case 'nightcore': {


                player.nightcore ? player.nightcore = false : player.nightcore = true;
                embed.setDescription(`${member.mention} 🎵 ${player.nightcore ? `enabled` : `disabled`} nightcore!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            case 'karaoke': {

                player.karaoke ? player.karaoke = false : player.karaoke = true;
                embed.setDescription(`${member.mention} 🎵 ${player.karaoke ? `enabled` : `disabled`} karaoke!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            case 'pop': {

                player.pop ? player.pop = false : player.pop = true;
                embed.setDescription(`${member.mention} 🎵 ${player.pop ? `enabled` : `disabled`} pop!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            case 'soft': {

                player.soft ? player.soft = false : player.soft = true;
                embed.setDescription(`${member.mention} 🎵 ${player.soft ? `enabled` : `disabled`} soft!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            case 'vaporwave': {

                player.vaporwave ? player.vaporwave = false : player.vaporwave = true;
                embed.setDescription(`${member.mention} 🎵 ${player.vaporwave ? `enabled` : `disabled`} vaporwave!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            case 'eightd': {

                player.eightD ? player.eightD = false : player.eightD = true;
                embed.setDescription(`${member.mention} 🎵 ${player.eightD ? `enabled` : `disabled`} eightd!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            case 'tremelo': {

                player.tremelo ? player.tremelo = false : player.tremelo = true;
                embed.setDescription(`${member.mention} 🎵 ${player.tremelo ? `enabled` : `disabled`} tremelo!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            case 'vibrato': {

                player.vibrato ? player.vibrato = false : player.vibrato = true;
                embed.setDescription(`${member.mention} 🎵 ${player.vibrato ? `enabled` : `disabled`} vibrato!`);
                interaction.createFollowup({ embeds: [embed] });

                break;
            }

            default: {

                embed.setDescription(`${member.mention} 🎵 You must specify a valid effect!`);
                interaction.createFollowup({ embeds: [embed] });
            }


        }





    }

    }