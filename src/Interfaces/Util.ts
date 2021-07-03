import type {Bot} from "../client/Client";
import Command from "./Command";

// Package imports
import {RichEmbed} from "eris";
import axios from "axios";
import {distance} from "fastest-levenshtein";
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
  resolvePrefix(id: any) {
    throw new Error("Method not implemented.");
  }
  succEmbed(arg0: string, channel: any): unknown {
    throw new Error("Method not implemented.");
  }
  validateHex(arg0: string) {
    throw new Error("Method not implemented.");
  }
  sendError(arg0: string, channel: any): unknown {
    throw new Error("Method not implemented.");
  }
  public readonly client: Bot;

  private readonly yes: string[] = ["yes", "si", "yeah", "ok", "sure"];
  private readonly no: string[] = ["no", "nope", "nada"];



  constructor(client: Bot) {
    this.client = client;
  }
  roleHierarchy(message, target) {
    const memberRole = this.getHighestRole(message.member, message.guild);
    const targetRole = this.getHighestRole(target, message.guild);
    if (memberRole && targetRole) {
      return memberRole > targetRole;
    } else {
      return true;
    }
  }

  async loggingChannel(guild, type: string) {
    if(!type) throw new TypeError(`No type provided.`);
    const locatedGuild = await guild_schema.findOne({ guildID: guild.id });
    if (!locatedGuild) return null;
    let locatedType = locatedGuild.Logging[type];
    if(!locatedType) return null;
    return locatedType ? guild.channels.get(locatedType) : null;
  }

  createButton(message, label: string = '', style: number, url: string = '', id: string, emotes = {}) {
    if(url) {
      return [{
        "type": 1,
        "components": [{
          "type": 2,
          "label": label,
          "style": style,
          "url": url,
        }]
      }]
    }
     return [{
          "type": 1,
          "components": [{
            "type": 2,
            "label": label,
            "style": style,
            "custom_id": id,
          }]
        }]
  }

  createSelection(id: string, placeholder: string, options: Array<SelectionObject>, minValue: number = 1, maxValue: number = 3) {
    console.log(options)
    return [
  {
    type: 1,
    components: [
      {
        type: 3,
        custom_id: id,
        options,
        placeholder: placeholder,
        min_values: minValue,
        max_values: maxValue
      }
    ]
  }
];


  }

  msConversion(millis: number) {
    let sec: any = Math.floor(millis / 1000);
    let hrs: any = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min: any = Math.floor(sec / 60);
    sec -= min * 60;

    sec = "" + sec;
    sec = ("00" + sec).substring(sec.length);

    if (hrs > 0) {
      min = "" + min;
      min = ("00" + min).substring(min.length);
      return hrs + ":" + min + ":" + sec;
    } else {
      return min + ":" + sec;
    }
  }


  getChannel(e, guild) {
    const mentionRegex = /^<#[0-9]+>$/;
    if (mentionRegex.test(e)) {
      const id = e.substring(2, e.length - 1);
      return guild.channels.get(id);
    }
    if (Number.isInteger(+e)) {
      // ID provided. Validate ID here.
      return guild.channels.get(e);
    }
    if (isNaN(e)) {
      const channel = guild.channels.filter((c) => distance(e, c.name) < 2.5);
      if (!channel.length) return null;
      return channel[0];
    }
    return null;
  }

  async guildPremium(guild) {
    const guildSchema = await guild_schema.findOne({ guildID: guild.id });
    if (!guildSchema) return false;
    if (!guildSchema?.Premium.active) return false;
    return guildSchema.Premium.expiresOn <= Date.now();

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

  async checkModerator(message) {
    if (!message.channel.guildID) return true;
    const guildModRoles = await guild_schema.findOne({
      guildID: message.channel.guild.id,
    });
    if (!guildModRoles || !guildModRoles.ModRole.length) {
      return message.member.permissions.has("manageMessages");
    }
    return message.member.roles.some((role) =>
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

  cleanPerms(perm) {
    const perms: Object = {
      banMembers: "Ban Members",
      kickMembers: "Kick Members",
    };
    return perms[perm] ?? perm;
  }

  async getMember(message, args) {
    if (!args.length) return new TypeError(`No args provided.`);
    if (Number(+args)) {
      let id = message.channel.guild.members.get(args);
      if (!id)
        return message.channel.createMessage({
          content: `Unable to locate "${args}".`,
          messageReference: { messageID: message.id },
        });

      let memberArray: string[] = Array();
      return id;
    }
    let member = message.mentions.length
      ? message.guild.members.get(message.mentions[0].id)
      : await message.channel.guild.searchMembers(args, 1);
    if (!member || Array.isArray(member) ? !member.length : false) {
      message.channel.createMessage({
        content: `Unable to locate "${args}".`,
        messageReference: { messageID: message.id },
      });
    }
    return Array.isArray(member) ? (member?.length ? member[0] : null) : member;
  }

  getRandomDadJoke(joke) {
    let config = {
      url: "https://icanhazdadjoke.com/",
      headers: {
        Accept: "application/json",
      },
    };
    axios(config)
      .then((response) => {
        return response.data.joke;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async runPreconditions(message, command: Command) {
    if (command.devOnly) {
      if (!this.client.owners.includes(message.author.id)) {
        let notOwnerEmbed = new RichEmbed()
          .setTitle(`Developer Only Command!`)
          .setDescription(`Only a Bot Developer can run this Command!`)
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Vade`, this.client.user.avatarURL);

        return message.channel.createMessage({
          embed: notOwnerEmbed,
          messageReferenceID: message.id,
        });
      }
    }
    if (command.guildOnly) {
      if (!message.channel.guild) {
        let noGuild = new RichEmbed()
          .setTitle(`Guild Only!`)
          .setDescription(`This Command can only be ran in a Guild!`)
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Vade`, this.client.user.avatarURL);
        return message.channel.createMessage({
          embed: noGuild,
          messageReferenceID: message.id,
        });
      }
    }

    if (!message.channel.guild) return;

    if (command.modCommand) {
      if (!(await this.checkModerator(message))) {
        let noMod = new RichEmbed()
          .setTitle(`Moderator Only!`)
          .setDescription(`This Command requires you to be a Moderator!`)
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Vade`, this.client.user.avatarURL);

        return message.channel.createMessage({
          embed: noMod,
          messageReferenceID: message.id,
        });
      }
    }

    if (command.botPerms) {
      for (const perm of command.botPerms) {
        let noPermEmbed = new RichEmbed()
          .setTitle(`Missing Permissions!`)
          .setDescription(
            `I am missing the ${this.cleanPerms(
              perm
            )} Permission! I need it for you to run this Command!`
          )
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Vade`, this.client.user.avatarURL);

        const getMember = message.channel.guild.members.get(
          this.client.user.id
        );
        if (!getMember?.permissions.has(perm)) {
          return message.channel.createMessage({
            embed: noPermEmbed,
            messageReferenceID: message.id,
          });
        }
      }
    }
    if (command.userPerms) {
      for (const perm of command.userPerms) {
        let noPermEmbed = new RichEmbed()
          .setTitle(`Missing Permissions!`)
          .setDescription(
            `You are missing the ${this.cleanPerms(
              perm
            )} Permission! You need it to run this Command!`
          )
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Vade`, this.client.user.avatarURL);
        if (!message.member.permissions.has(perm)) {
          return message.channel.createMessage({
            embed: noPermEmbed,
            messageReferenceID: message.id,
          });
        }
      }
    }
  }
}
