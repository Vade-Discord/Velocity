import type {Bot} from "../client/Client";
import Command from "./Command";

// Package imports

import { Collection, Guild, Interaction, Member, RichEmbed} from "eris";
import { distance } from "fastest-levenshtein";
import {Types} from "mongoose";


// File imports
import guild_schema from "../Schemas/Main Guilds/GuildSchema";

interface SelectionObject {
  label: string;
  value: string;
  description: string;
  emoji: {
    name: string;
    id: string;
  },
}

export default class Util {
  public readonly client: Bot;
  private readonly yes: string[] = ["yes", "si", "yeah", "ok", "sure"];
  private readonly no: string[] = ["no", "nope", "nada"];

  constructor(client: Bot) {
    this.client = client;
  }

  async checkModerator(interaction) {
    if (!interaction.guildId) return true;
    const guildModRoles = await guild_schema.findOne({
      guildID: interaction.guildId,
    });
    if (!guildModRoles || !guildModRoles.ModRole.length) {
      return interaction.member.permissions.has("manageMessages");
    }
    return interaction.member.roles.some((role) =>
        guildModRoles?.ModRole.includes(role)
    );
  }

  generateKey() {
    let length = 15,
        charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@!$£",
        retVal = "";
    let i = 0, n = charset.length;
    for (; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return `Vade_` + retVal;
  }
  caseID() {
    let length = 10,
        charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@!$£",
        retVal = "";
    let i = 0, n = charset.length;
    for (; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  capitalise(string: string) {
    if (string)
      return string
          .split(" ")
          .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
          .join(" ");
  }

  getHighestRole(member, guild) {
    member = member.id ? member : guild.members.get(member);
    const filteredRoles = guild.roles.filter((r) =>
        member.roles.includes(r.id)
    );
    return filteredRoles.sort((a, b) => b.position - a.position)[0];
  }

  async createGuildSchema(guild) {
    const newSchema = new guild_schema({
      _id: Types.ObjectId(),
      guildID: guild.id,
      guildName: guild.name,
      prefix: "!",
    });

    await newSchema.save();

    return newSchema;
  }

  cleanPerms(perm) {
    const perms: Object = {
      banMembers: "Ban Members",
      kickMembers: "Kick Members",
    };
    return perms[perm] ?? perm;
  }

  async loggingChannel(guild, type: string) {
    if(!type) throw new TypeError(`No type provided.`);
    const locatedGuild = await guild_schema.findOne({ guildID: guild.id });
    if (!locatedGuild) return null;
    let locatedType = locatedGuild.Logging[type];
    if(!locatedType) return null;
    return locatedType ? guild.channels.get(locatedType) : null;
  }

  async runPreconditions(interaction, member, g, command: Command) {
    const guild = await this.client.guilds.get(g.id);
    if (command.devOnly) {
      if (!this.client.owners.includes(interaction.user ? interaction.user.id : interaction.member.id)) {
        let notOwnerEmbed = new RichEmbed()
            .setTitle(`Developer Only Command!`)
            .setDescription(`Only a Bot Developer can run this Command!`)
            .setColor(`#F00000`)
            .setTimestamp()
            .setFooter(`Vade`, this.client.user.avatarURL);

        return interaction.createFollowup({
          embeds: [notOwnerEmbed]
        });
      }
    }
    if (command.guildOnly) {
      if (!interaction.guildID) {
        let noGuild = new RichEmbed()
            .setTitle(`Guild Only!`)
            .setDescription(`This Command can only be ran in a Guild!`)
            .setColor(`#F00000`)
            .setTimestamp()
            .setFooter(`Vade`, this.client.user.avatarURL);
        return interaction.createFollowup({
          embeds: [noGuild]
        });
      }
    }

    if (!guild) return;

    if (command.modCommand) {
      if (!(await this.checkModerator(interaction))) {
        let noMod = new RichEmbed()
            .setTitle(`Moderator Only!`)
            .setDescription(`This Command requires you to be a Moderator!`)
            .setColor(`#F00000`)
            .setTimestamp()
            .setFooter(`Vade`, this.client.user.avatarURL);

        return  interaction.createFollowup({
          embeds: [noMod]
        });
      }
    }

    if (command.botPerms.length) {
      const getMember = await guild.members.get(
          this.client.user.id
      );

      const checkBotPerms = command.botPerms.some((perm) => !getMember.permissions.has(perm));
      if(checkBotPerms) {
        let noPermEmbed = new RichEmbed()
            .setTitle(`Missing Permissions!`)
            .setDescription(
                `I am missing one of the required permissions for this Command. Required Permissions: ${command.botPerms.map((m) => this.cleanPerms(m)).join(", ")}`
            )
            .setColor(`#F00000`)
            .setTimestamp()
            .setFooter(`Vade`, this.client.user.avatarURL);

        return  interaction.createFollowup({
          embeds: [noPermEmbed]
        });
      }
    }
    if (command.userPerms.length) {
     const userPermCheck =  command.userPerms.some((perm) => !member.permissions.has(perm));
      if(userPermCheck) {
        let noPermEmbed = new RichEmbed()
            .setTitle(`Missing Permissions!`)
            .setDescription(
                `You are missing one of the required permissions for this Command. Required Permissions: ${command.userPerms.map((m) => this.cleanPerms(m)).join(", ")}`
            )
            .setColor(`#F00000`)
            .setTimestamp()
            .setFooter(`Vade`, this.client.user.avatarURL);

        return  interaction.createFollowup({
          embeds: [noPermEmbed]
        });
      }
    }
  }

  trimArray(arr: Array<string>, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);
      arr.push(`${len} more...`);
    }
    return arr;
  }

  getCommand(c: string): Command {
    const cmd = c?.toLowerCase()
     if(this.client.commands.has(cmd)) {
       return this.client.commands.get(cmd);
     } else if(this.client.subCommands.has(cmd)) {
       return this.client.subCommands.get(cmd);
     } else {
       return null;
     }
  }
}
