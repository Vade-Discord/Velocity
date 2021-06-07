"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = exports.run = void 0;
const run = async (client, message) => {
    if (message.author.bot)
        return;
    const prefix = client.config.prefix;
    if (message.content?.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(' ');
        let cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd?.toLowerCase()) || client.commands.get(client.aliases.get(cmd?.toLowerCase()));
        if (!command)
            return;
        const check = await client.utils.runPreconditions(message, command);
        if (check)
            return;
        await command.run(message, args);
    }
};
exports.run = run;
exports.name = "messageCreate";
