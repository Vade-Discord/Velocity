"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Interfaces/Command"));
class BanCommand extends Command_1.default {
    constructor(client) {
        super(client, 'ban', {
            aliases: ["addban", 'guildban'],
            description: "Ban a member from the server.",
            category: "Moderation",
            userPerms: ['banMembers'],
            botPerms: ['banMembers']
        });
    }
    async run(message, args) {
        let members = message.mentions;
        if (!members.length) {
            members = args;
            if (!members.length)
                return message.channel.createMessage({ content: `You need to either mention the users or their ID.`, messageReferenceID: message.id });
        }
        message.channel.createMessage(`Member validation check successful`);
        if (message.mentions.length) {
            for (const mention of message.mentions) {
                args.shift();
                message.channel.createMessage(`Mention detected: ${mention}`);
            }
            message.channel.createMessage(`Args now: ${args}`);
        }
        else {
            for (const arg of args) {
                if (isNaN(parseInt(arg))) {
                    const member = await message.channel.guild.searchMembers(arg, 1);
                    if (!member.length)
                        return message.channel.createMessage({ content: `Unable to locate the member: "${arg}"`, messageReferenceID: message.id });
                    message.channel.createMessage({ content: `Somehow found a member: ${member[0].user.username}#${member[0].user.discriminator}`, messageReferenceID: message.id });
                }
                else {
                    const member = message.channel.guild.members.get(arg);
                    if (!member)
                        return message.channel.createMessage({ content: `Unable to locate the member: "${arg}"`, messageReferenceID: message.id });
                    message.channel.createMessage({ content: `Somehow found a member: ${member.user.username}#${member.user.discriminator}`, messageReferenceID: message.id });
                }
            }
        }
    }
}
exports.default = BanCommand;
