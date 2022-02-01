import cluster from "cluster"
import { Logger } from "@dimensional-fun/logger";
import Eris, {Guild} from "eris";
import Collection from "@discordjs/collection";
import glob from "glob";
import { promisify } from "util";
import Config from "../config.json";
import Command from "../Interfaces/Command";
import type { Event } from "../Interfaces/Event";
import Util from "../Interfaces/Util";
import MessageEmbed = require("../Classes/Embeds");
import Constants from '../Interfaces/Constants';
import { API } from '../api/API';
import Spotify from 'better-erela.js-spotify';
import {resolve} from "path"


import { RedisClient } from 'ioredis';
import {Manager} from "erela.js";
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";
import Filter from "erela.js-filters";
import AppleMusic from 'better-erela.js-apple';
import AutoMod from "../Classes/AutoMod";

const nodes: any = [
  {
    host: Config.lavalink.host,
    password: Config.lavalink.password,
    port: Config.lavalink.port,
  },
];

const clientId: string = Config.lavalink.SPOTIFY_CLIENT_ID;
const clientSecret: string = Config.lavalink.SPOTIFY_SECRET_ID;

const globPromise = promisify(glob);

export class Bot extends Eris.Client {
    [x: string]: any;
  public static __instance__?: Bot;
  public logger: Logger = new Logger("client");
  public commands: Collection<string, Command> = new Collection();
  public token = Config.token;
  public Pagination = new Collection();
  public categories: Set<string> = new Set();
  public events: Collection<string, Event> = new Collection();
  public cooldowns: Collection<string, number> = new Collection();
  public autoplay: string[] = Array();
  public owners: string[] = ["492017874290868227", "502553365595684884"];
  public utils: Util = new Util(this);
  public automod: AutoMod = new AutoMod(this);
  public constants: typeof Constants = Constants;
  // @ts-ignore
  public embed: typeof MessageEmbed | typeof Eris.RichEmbed = MessageEmbed;
  public config: typeof Config = Config;
  public manager = new Manager({
    nodes,
    plugins: [
      new Spotify({
        strategy: 'API',
        clientId,
        clientSecret,
      }),
      new Deezer({}),
      new Facebook(),
      new Filter(),
      new AppleMusic()
    ],
    autoPlay: true,
    send: (id, payload) => {
      const guild = this.guilds.get(id) as Guild;
      if(guild)  guild.shard.sendWS(payload.op, payload.d)
    },
  });
 public redis: RedisClient = undefined;
  public constructor(token: string, _options: Eris.ClientOptions = { intents: undefined}) {

    super(Config.token ?? token, {
      intents: [
        "guilds",
        "guildMessages",
        "guildVoiceStates",
        "directMessages",
        "guildMembers",
        "guildBans",
          "guildInvites",
        // @ts-ignore
          "guildScheduledEvents"

      ],
        seedVoiceConnections: true,
        restMode: true,
    });
    if (Bot.__instance__) throw new Error("Another client was created.");

    Bot.__instance__ = this;
  }

  public async connect() {
    await this.start()
    super.connect()
  
  }

  public async start(): Promise<void> {
    this.logger.info(`Starting process..`);
    (new API(this)).start()
//     // /* load command files */
    const commandFiles: string[] = await globPromise(
        `${__dirname}/../Commands/**/*{.ts,.js}`
    );
    for (const file of commandFiles) {
      delete require.cache[file];
      const module = await import(file)

      const command: Command = new module.default(this);
     if(!this.commands.has(command.name)) this.commands.set(command.name, command);
     if(!this.categories.has(command.category)) this.categories.add(command.category);
    }
    console.log("Commands loaded");
    // commandFiles.map(async (value: string) => {
    //   (import(value)).then(async module => {
    //     new (await module.default(this)).then((file) => {
    //       this.commands.set(file.name, file);
    //       this.categories.add(file.category);
    //     });
    //   }).catch(error => console.log(error));
    // });
    const eventFiles: string[] = await globPromise(
        `${__dirname}/../Events/**/*{.ts,.js}`
    );
    for (const file of eventFiles) {
      delete require.cache[file];
      const { default: Event } = await import(file);
      const event: Event = new Event(this);
      if(!this.events.has(event.name)) {
        this.events.set(event.name, event);
        event.emitter[event.type](event.name, (...args) => event.run(...args));
      }

    }
    // eventFiles.map(async (value: string) => {
    //   (import(value)).then(async module => {
    //     new (await module.default(this)).then((file) => {
    //       this.events.set(file.name, file);
    //       file.emitter[file.type](file.name, (...args) => file.run(...args));
    //     });
    //   }).catch(error => console.log(error));
    // });


  }
  static get instance() {
    return Bot.__instance__;
  }
}
