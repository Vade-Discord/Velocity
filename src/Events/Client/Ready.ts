import { Event } from '../../Interfaces/Event';
import mongo from '../../Interfaces/Database';
import redisConnect from "../../Interfaces/Redis";

export default class ReadyEvent extends Event {
    constructor(client) {
        super(client, "ready", {
            once: true,
        });
    }

    async run() {
        await mongo();
        this.client.redis = await redisConnect();
        console.log(`${this.client.user.username}#${this.client.user.discriminator} has successfully logged in!`);

        const guild = this.client.guilds.get("857895083839324190");

        this.client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com" });

        const commands = []

        await this.client.commands.forEach((command) => {
           commands.push({
               options: command.options,
               name: command.name,
               description: command.description,
               defaultPermission: command.devOnly,
           });
        });
        if(this.client.user.id === this.client.config.CLIENTS.beta) {
            guild.bulkEditCommands(commands)
        } else if(this.client.user.id === this.client.config.CLIENTS.main){
            this.client.bulkEditCommands(commands)
        }
    }

}