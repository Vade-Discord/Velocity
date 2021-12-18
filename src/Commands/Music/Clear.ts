import Command from "../../Interfaces/Command";

export default class ClearCommand extends Command {
    constructor(client) {
        super(client, 'clear', {
            description: "Clear the Music queue!",
            category: "Music",
            ephemeral: true,
        });
    }
    async run(interaction, member, options, subOptions) {

        const player = this.client.manager.players.get(interaction.guildID);
        if(!player || !player.queue?.length) {
            return interaction.createMessage({ content: "There is nothing currently in the queue! You can use the /skip command to remove the current song.", flags: 64 });
        }
        const current = player.queue.current;
        player.destroy();
        const embed = new this.client.embed()
            .setAuthor("Successfully cleared the queue!", this.client.user.avatarURL)
            .setColor(this.client.constants.colours.green)
            .setTimestamp()
            .setFooter(`Requested by ${member.username}#${member.discriminator}`, member.avatarURL);

        await interaction.createMessage({ embeds: [embed], flags: 64 });
        interaction.createFollowup(`The queue has been cleared by ${member.mention}.`);

    }

    }