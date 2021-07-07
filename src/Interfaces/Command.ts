import { Bot } from "../client/Client";

interface CommandOptions {
  aliases?: string[];
  description?: string;
  category: string;
  usage?: string;
  userPerms?: string[];
  botPerms?: string[];
  guildOnly?: boolean;
  devOnly?: boolean;
  nsfw?: boolean;
  cooldown?: number;
  vadeOnly?: boolean;
  args?: string[];
  premiumOnly?: boolean;
  modCommand?: boolean;
  disabled?: boolean;
  adminCommand?: boolean;
}

export default class Command {
  public name: string;
  public aliases?: string[];
  public description?: string;
  public category: string;
  public usage?: string;
  public userPerms?: string[];
  public botPerms?: string[];
  public guildOnly?: boolean;
  public devOnly?: boolean;
  public nsfw?: boolean;
  public cooldown?: number;
  public vadeOnly?: boolean;
  public args?: string[];
  public premiumOnly?: boolean;
  public modCommand?: boolean;
  public disabled?: boolean;
  public adminCommand?: boolean;
  public client: Bot;

  constructor(client: Bot, name, options: CommandOptions) {
    this.client = client;
    this.name = name;
    this.aliases = options.aliases || [];
    this.description = options.description || "No description provided.";
    this.category = options.category || "Miscellaneous";
    this.usage = options.usage || "No usage provided.";
    this.userPerms = options.userPerms || ["sendMessages"];
    this.botPerms = options.botPerms || ["sendMessages"];
    this.guildOnly = options.guildOnly || false;
    this.devOnly = options.devOnly || false;
    this.nsfw = options.nsfw || false;
    this.cooldown = options.cooldown || 1;
    this.vadeOnly = options.vadeOnly || false;
    this.premiumOnly = options.premiumOnly || false;
    this.modCommand = options.modCommand || false;
    this.disabled = options.disabled || false;
    this.adminCommand = options.adminCommand || false;
    this.args = options.args || [];
  }

  async run(message, args) {
    throw new Error(`Command ${this.name} doesn't provide a run method!`);
  }

  async runInteraction(interaction, args) {
    throw new Error(`Command ${this.name} doesn't provide a runInteraction method!`);
  }
}
