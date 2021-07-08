"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../../interfaces/Event");
const Database_1 = __importDefault(require("../../Interfaces/Database"));
const Lavalink_1 = require("../../Interfaces/Lavalink");
class ReadyEvent extends Event_1.Event {
    constructor(client) {
        super(client, "ready", {
            once: true,
        });
    }
    async run() {
        await Database_1.default();
        await Lavalink_1.Lavalink(this.client);
        console.log(`${this.client.user.username}${this.client.user.discriminator} has successfully logged in!`);
        this.client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com" });
    }
}
exports.default = ReadyEvent;
