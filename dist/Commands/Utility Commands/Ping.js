"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Interfaces/Command"));
const eris_1 = require("eris");
class PingCommand extends Command_1.default {
    constructor(client) {
        super(client, "ping", {
            aliases: ["pong"],
            description: "Check the bots ping!",
            category: "Utility",
        });
    }
    async run(message, args) {
        await message.channel.createMessage("Pinging...").then((m) => {
            let ping = m.createdAt - message.createdAt;
            const pingEmbed = new eris_1.RichEmbed()
                .setTitle(`Pong!`)
                .setDescription(`Bot Latency: ${ping}ms`)
                .setTimestamp()
                .setFooter(`Velocity`, this.client.user.avatarURL);
            m.edit({ content: `Pong!`, embed: pingEmbed });
        });
    }
}
exports.default = PingCommand;
