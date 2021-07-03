import { Logger } from "@dimensional-fun/logger";
import Eris from "eris";
import pluris from "pluris";
import Collection from "@discordjs/collection";
import glob from "glob";
import { promisify } from "util";
import Config from "../config.json";
import Command from "../interfaces/Command";
import type { Event } from "../interfaces/Event";
import Util from "../Interfaces/Util";
import MessageEmbed = require("../Classes/Embeds");
import Constants from '../Interfaces/Constants';

const globPromise = promisify(glob);

export class Bot extends Eris.Client {
  public static __instance__?: Bot;
  public logger: Logger = new Logger("vade");
  public commands: Collection<string, Command> = new Collection();
  public token = Config.token;
  public aliases: Collection<string, string> = new Collection();
  public categories: Set<string> = new Set();
  public events: Collection<string, Event> = new Collection();
  public cooldowns: Collection<string, number> = new Collection();
  public autoplay: string[] = Array();
  public config: typeof Config;
  public owners: string[] = ["473858248353513472"];
  public utils: Util = new Util(this);
  public constants: typeof Constants = Constants;
  public embed: typeof MessageEmbed = MessageEmbed;
  public manager = undefined;
  public constructor(options: Eris.ClientOptions = {}) {
    super(Config.token);
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
      if (file.aliases?.length) {
        file.aliases.map((value: string) => this.aliases.set(value, file.name));
      }
    });

    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/**/*{.ts,.js}`
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
