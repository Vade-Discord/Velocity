import Command from "../../Interfaces/Command";

export default class SkipCommand extends Command {
    constructor(client) {
        super(client, 'skip', {
            description: "Skip the currently playing song!",
            category: "Music",
        });
    }
    async run(interaction, member, options, subOptions) {

        const player = this.client.manager.players.get(interaction.guildID);
        if(!player)  {
            return interaction.createFollowup(`There is nothing playing.`);
        }
        let embed = new this.client.embed()
            .setDescription(`${member.mention} ⏭ skipped [${player.queue.current.title}](${player.queue.current.uri})`)

       interaction.createFollowup({ embeds: [embed] });
        player.stop();


    }

    }