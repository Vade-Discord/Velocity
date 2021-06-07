"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
class Util {
    constructor(client) {
        this.yes = ["yes", "si", "yeah", "ok", "sure"];
        this.no = ["no", "nope", "nada"];
        this.client = client;
    }
    roleHierarchy(message, target) {
        const memberRole = this.getHighestRole(message.member, message.guild);
        const targetRole = this.getHighestRole(target, message.guild);
        if (memberRole && targetRole) {
            return memberRole > targetRole;
        }
        else {
            return true;
        }
    }
    getHighestRole(member, guild) {
        member = member.id ? member : guild.members.get(member);
        const filteredRoles = guild.roles.filter(r => member.roles.includes(r.id));
        return filteredRoles.sort((a, b) => b.position - a.position)[0];
    }
    cleanPerms(perm) {
        const perms = {
            "banMembers": "Ban Members",
            "kickMembers": "Kick Members"
        };
        if (perms[perm]) {
            return perms[perm];
        }
        else {
            return perm;
        }
    }
    runPreconditions(message, command) {
        if (command.devOnly) {
            if (!this.client.owners.includes(message.author.id)) {
                let notOwnerEmbed = new eris_1.RichEmbed()
                    .setTitle(`Developer Only Command!`)
                    .setDescription(`Only a Bot Developer can run this Command!`)
                    .setColor(`#F00000`)
                    .setTimestamp()
                    .setFooter(`Vade`, this.client.user.avatarURL);
                return message.channel.createMessage({ embed: notOwnerEmbed, messageReferenceID: message.id });
            }
        }
        if (command.botPerms) {
            for (const perm of command.botPerms) {
                let noPermEmbed = new eris_1.RichEmbed()
                    .setTitle(`Missing Permissions!`)
                    .setDescription(`I am missing the ${this.cleanPerms(perm)} Permission! I need it for you to run this Command!`)
                    .setColor(`#F00000`)
                    .setTimestamp()
                    .setFooter(`Vade`, this.client.user.avatarURL);
                const getMember = message.channel.guild.members.get(this.client.user.id);
                if (!getMember?.permissions.has(perm)) {
                    return message.channel.createMessage({ embed: noPermEmbed, messageReferenceID: message.id });
                }
            }
        }
        if (command.userPerms) {
            for (const perm of command.userPerms) {
                let noPermEmbed = new eris_1.RichEmbed()
                    .setTitle(`Missing Permissions!`)
                    .setDescription(`You are missing the ${this.cleanPerms(perm)} Permission! You need it to run this Command!`)
                    .setColor(`#F00000`)
                    .setTimestamp()
                    .setFooter(`Vade`, this.client.user.avatarURL);
                if (!message.member.permissions.has(perm)) {
                    return message.channel.createMessage({ embed: noPermEmbed, messageReferenceID: message.id });
                }
            }
        }
        if (command.guildOnly) {
            if (!message.channel.guild) {
                let noGuild = new eris_1.RichEmbed()
                    .setTitle(`Guild Only!`)
                    .setDescription(`This Command can only be ran in a Guild!`)
                    .setColor(`#F00000`)
                    .setTimestamp()
                    .setFooter(`Vade`, this.client.user.avatarURL);
                return message.channel.createMessage({ embed: noGuild, messageReferenceID: message.id });
            }
        }
    }
}
exports.default = Util;
