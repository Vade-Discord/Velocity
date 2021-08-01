import Command from "../../Interfaces/Command";

export default class PingCommand extends Command {
    constructor(client) {
        super(client, 'ping', {
            aliases: [""],
            description: "Check the bots ping!",
            category: "Main",
        });
    }
    async run(interaction, member) {

        const date = interaction.createdAt;

        let embed = new this.client.embed()
            .setAuthor(`Bot Latency!`)
            .setDescription(`Latency: **${Date.now() - date}ms**`)

       // @ts-ignore
    interaction.createFollowup({ embeds: [embed]});

     }

    }
