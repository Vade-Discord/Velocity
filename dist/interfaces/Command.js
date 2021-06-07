"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(client, name, options) {
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
        this.args = options.args || false;
        this.premiumOnly = options.premiumOnly || false;
        this.modCommand = options.modCommand || false;
        this.disabled = options.disabled || false;
        this.adminCommand = options.adminCommand || false;
    }
    async run(message, args) {
        throw new Error(`Command ${this.name} doesn't provide a run method!`);
    }
}
exports.default = Command;
;
