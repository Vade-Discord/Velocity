import { Event } from '../../Interfaces/Event';
import mongo from '../../Interfaces/Database';
import redisConnect from "../../Interfaces/Redis";
import {Lavalink} from "../../Interfaces/Lavalink";
let e;

export default class ReadyEvent extends Event {
    constructor(client) {
        super(client, "ready", {
            once: true,
        });
    }

    async run() {
        await this.client.manager.init(this.client.user.id);
        e = this.client;
        await mongo();
        this.client.redis = await redisConnect(this.client);
        this.client.logger.info(`${this.client.user.username}#${this.client.user.discriminator} has successfully logged in!`);

        const nf = new Intl.NumberFormat();

        const activities = {
            get "0"() {
                return `Powering ${nf.format(e.guilds.size)} servers! |  Cluster ${this.client.cluster.id}`;
            },
            get "1"() {
                return `discord.gg/AznMQg5cSA | vade-bot.com | Cluster ${this.client.cluster.id}`;
            },
            get "2"() {
                return `${nf.format(
                    e.users.size
                )} users! | Cluster ${this.client.cluster.id}`;
            },
        };

        let i = 0;
        const commands = [];
        const contextCommands = [];
        await this.client.commands.forEach((command) => {
            if(!command.contextOnly) {
                commands.push({
                    options: command.options,
                    name: command.name,
                    description: command.description,
                    defaultPermission: command.devOnly,
                });
            }
        });

        const contextFiltered = this.client.commands.filter(m => m.contextUserMenu);
        await contextFiltered.forEach((command) => {
            commands.push({
                name: this.client.utils.capitalise(command.name),
                defaultPermission: command.devOnly,
                type: command.contextType,
            });
        });
        if(this.client.user.id === this.client.config.CLIENTS.beta) {
            const guild = await this.client.getRESTGuild(this.client.config.GUILDS.testing);
            guild.bulkEditCommands(commands);
        } else if(this.client.user.id === this.client.config.CLIENTS.main){
            this.client.bulkEditCommands(commands);
        }

        setInterval(
            () =>
                this.client.editStatus(`online`, {
                    type: 5,
                    name: `/help | ${activities[i++ % 3]}`,
                    url: "https://vade-bot.com"
                }),
            15000
        );
    }

}
