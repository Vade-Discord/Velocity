import { Logger } from "@dimensional-fun/logger";
import Eris, {Guild} from "eris";
import Collection from "@discordjs/collection";
import glob from "glob";
import { promisify } from "util";
import Config from "../config.json";
import Command from "../interfaces/Command";
import type { Event } from "../interfaces/Event";
import Util from "../Interfaces/Util";
import MessageEmbed = require("../Classes/Embeds");
import Constants from '../Interfaces/Constants';
import { API } from '../api/API';
import Spotify from 'better-erela.js-spotify';


import { RedisClient } from 'ioredis';
import {Manager} from "erela.js";
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";
import Filter from "erela.js-filters";
import AppleMusic from 'better-erela.js-apple';

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
  public static __instance__?: Bot;
  public logger: Logger = new Logger("client");
  public commands: Collection<string, Command> = new Collection();
  public token = Config.token;
  public Pagination = new Collection();
  public categories: Set<string> = new Set();
  public events: Collection<string, Event> = new Collection();
  public cooldowns: Collection<string, number> = new Collection();
  public autoplay: string[] = Array();
  public config: typeof Config;
  public owners: string[] = ["492017874290868227", "502553365595684884", "473858248353513472"];
  public utils: Util = new Util(this);
  public constants: typeof Constants = Constants;
  public embed: typeof MessageEmbed | typeof Eris.RichEmbed = MessageEmbed;
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
  public constructor(_options: Eris.ClientOptions = { intents: undefined}) {
    super(Config.token, {
      intents: [
        "guilds",
        "guildMessages",
        "guildVoiceStates",
        "directMessages",
        "guildMembers",
        "guildBans",
          "guildInvites",
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
    await this.connect();
    const api = new API(this);
    api.start(); // Start the API.
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
