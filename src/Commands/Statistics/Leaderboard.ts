import Command from "../../Interfaces/Command";
import voiceSchema from "../../Schemas/User Schemas/Voice";
import { createPaginationEmbed } from "../../Classes/Pagination";
import { Paginate } from '@the-nerd-cave/paginate';
import humanise from 'humanize-duration';

export default class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, 'leaderboard', {
            description: "View a certain leaderboard.",
            category: "Statistics",
                    options: [
                        {
                            type: 3,
                            name: 'type',
                            description: `The type of leaderboard you would like to view.`,
                            required: true,
                            choices: [
                                {
                                    name: 'voice activity',
                                    value: 'voice',
                                },
                                {
                                    name: 'invites',
                                    value: 'invites',
                                },
                                {
                                    name: 'economy',
                                    value: 'economy',
                                },
                            ]
                        },

            ],
        });
    }
    async run(interaction, member) {
        const guild = await this.client.getRESTGuild(interaction.guildID);

        const data = interaction.data.options[0].value;

        switch (data) {
            case "invites": {

                interaction.createFollowup(`Test`);
                break;
            }

            case "economy": {

                interaction.createFollowup(`Test`);
                break;
            }

            case "voice": {
                const allVoice = await voiceSchema.find({ guild: interaction.guildID});
                if(!allVoice.length) {
                    return interaction.createFollowup(`There doesn't seem to be an existing leaderboard for that..`);
                }
                const mapped = allVoice.sort((x, y) => y.total - x.total).map((m, i) => `**${i + 1}**. ${m.username} - ${humanise(m.total, { long: false})}`)
                const pages = new Paginate(mapped, 8).getPaginatedArray();
                const embeds = pages.map((page, index) => {
                    return new this.client.embed()
                        .setTitle(`${guild.name}'s Voice Activity`)
                        .setDescription(
                            page.join("\n") ??
                            `No more to be listed on page ${index + 1}`
                        )
                        .setTimestamp();
                });
                if(embeds.length == 1) {
                    return interaction.createFollowup({ embeds: [embeds[0]]});
                }
                await createPaginationEmbed(this.client, interaction, embeds, {});
                break;
            }
        }



    }

}
