import { Event } from '../../Interfaces/Event';
import mongo from '../../Interfaces/Database';
import redisConnect from "../../Interfaces/Redis";
import { Lavalink } from "../../Interfaces/Lavalink";

export default class ReadyEvent extends Event {
    constructor(client) {
        super(client, "ready", {
            once: true,
        });
    }

    async run() {
        await mongo();
        this.client.redis = await redisConnect(this.client);
        this.client.logger.info(`${this.client.user.username}#${this.client.user.discriminator} has successfully logged in!`);
        const guild = this.client.guilds.get("794770969079185420");

        this.client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com" });

        const commands = [];
        const contextCommands = [];
        await this.client.commands.forEach((command) => {
           commands.push({
               options: command.options,
               name: command.name,
               description: command.description,
               defaultPermission: command.devOnly,
           });
        });

        const contextFiltered = this.client.commands.filter(m => m.contextUserMenu);
        await contextFiltered.forEach((command) => {
            commands.push({
                name: this.client.utils.capitalise(command.name),
                defaultPermission: command.devOnly,
                type: 2,
            });
        });
        if(this.client.user.id === this.client.config.CLIENTS.beta) {
            guild.bulkEditCommands(commands);
        } else if(this.client.user.id === this.client.config.CLIENTS.main){
            this.client.bulkEditCommands(commands);
        }
    }

}