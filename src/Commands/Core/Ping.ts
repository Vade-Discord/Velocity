import Command from "../../Interfaces/Command";

export default class PingCommand extends Command {
    constructor(client) {
        super(client, 'ping', {
            aliases: [""],
            description: "Check the bots ping!",
            category: "Core",
        });
    }
    async run(interaction, member) {

        const date: number = interaction.createdAt;

        let embed = new this.client.embed()
            .setAuthor(`Bot Latency!`)
            .setDescription(`Latency: **${Date.now() - date}ms**`)

    interaction.createFollowup({ embeds: [embed]});

     }

    }
