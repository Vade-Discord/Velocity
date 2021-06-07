"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = exports.run = void 0;
const run = async (client) => {
    console.log(`${client.user.username}${client.user.discriminator} has successfully logged in!`);
    client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com" });
};
exports.run = run;
exports.name = "ready";
