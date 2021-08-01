import Eris from 'eris';
import { Logger } from '@dimensional-fun/logger'
import { promisify } from "util";
import Config from '../config.json';
import { Collection } from '@discordjs/collection';
import glob from 'glob';
import Command from '../Interfaces/Command';
import { Event } from '../Interfaces/Event';
import MessageEmbed = require("../Classes/Embeds");
import pluris from 'pluris'
const globPromise = promisify(glob);

export class Bot extends Eris.Client {
    public static __instance__?: Bot;
    public logger: Logger = new Logger("vade");
    public commands: Collection<string, Command> = new Collection();
    public token = Config.token;
    public aliases: Collection<string, string> = new Collection();
    public categories: Set<string> = new Set();
    public events: Collection<string, Event> = new Collection();
    public config: typeof Config;
    public embed: typeof MessageEmbed = MessageEmbed;
    public owners: string[] = ["473858248353513472"];
    public Pagination = new Collection();
    public constructor(options: Eris.ClientOptions = {intents: undefined}) {
        super(Config.token, {
            intents: [
                "guilds",
                "guildMessages",
                "guildVoiceStates",
                "directMessages"
            ],
            seedVoiceConnections: true,
            restMode: true,
        });
        if (Bot.__instance__) throw new Error("Another client was created.");

        Bot.__instance__ = this;
    }
    public async start(config: typeof Config): Promise<void> {
        this.logger.info("hi");
        this.config = config;
        await pluris(Eris);
        await this.connect();
        /* load command files */
        const commandFiles: string[] = await globPromise(
            `${__dirname}/../Commands/**/*{.ts,.js}`
        );
        commandFiles.map(async (value: string) => {
            const file: Command = new (await import(value)).default(this);
            this.commands.set(file.name, file);
            this.categories.add(file.category);
        });

        const eventFiles: string[] = await globPromise(
            `${__dirname}/../Events/**/*{.ts,.js}`
        );
        eventFiles.map(async (value: string) => {
            const file: Event = new (await import(value)).default(this);
            this.events.set(file.name, file);
            file.emitter[file.type](file.name, (...args) => file.run(...args));
        });
    }
    static get instance() {
        return Bot.__instance__;
    }
}