import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";

export default class PingCommand extends Command {
    constructor(client) {
        super(client, 'ping', {
            aliases: ["pong"],
            description: "Check the bots ping!",
            category: "Utility",
        });
    }
    async run(message, args) {

    await message.channel.createMessage("Pinging...").then((m) => {
        let ping = m.createdAt - message.createdAt;
        console.log(ping)
        const pingEmbed = new RichEmbed()
            .setTitle(`Pong!`)
            .setDescription(`Bot Latency: ${ping}ms`)
            .setTimestamp()
            .setFooter(`Vade`, this.client.user.avatarURL)

        m.edit({content: `Pong!`, embed: pingEmbed});

    });


     }

    }
