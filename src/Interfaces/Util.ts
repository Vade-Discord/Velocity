import type { Bot } from "../client/Client";
import Command from "./Command";

// Package imports
import {Client, RichEmbed, Guild, TextChannel} from "eris";
import { Types } from "mongoose";

// File imports
import guild_schema from "../Schemas/Main-Guilds/GuildSchema";
import profile_schema from "../Schemas/User Schemas/Profile";
import { scamLinks } from "../Assets/Scam.json";
import GiveawaySchema from "../Schemas/Backend/Giveaways";
import ReminderSchema from "../Schemas/Backend/Reminders";
import phin from "phin";

interface SelectionObject {
  label: string;
  value: string;
  description: string;
  emoji: {
    name: string;
    id: string;
  },
}


Client.prototype.getUser = async function (id) {
  const cur = this.users.get(id);
  if (cur) return cur;
  const u = await this.getRESTUser(id).catch(() => null);
  if (u !== null) {
    this.users.add(u);
    return u;
  } else return null;
}

Guild.prototype.getMember = async function (id) {
  const cur = this.members.get(id);
  if (cur) return cur;
  const u = await this.getRESTMember(id).catch(() => null);
  if (u !== null) {
    this.members.add(u);
    return u;
  } else return null;
}

export default class Util {
  public readonly client: Bot;
  private readonly yes: string[] = ["yes", "si", "yeah", "ok", "sure"];
  private readonly no: string[] = ["no", "nope", "nada"];

  constructor(client: Bot) {
    this.client = client;
  }

  async checkModerator(member, guild) {
    const guildModRoles = (await this.getGuildSchema(guild))!!;
    if(member.permissions.has("manageMessages")) {
      return true;
    }
    if (!guildModRoles || !guildModRoles?.ModRole.length) {
      return member.permissions.has("manageMessages");
    }
    return member.roles.some((role) =>
      guildModRoles?.ModRole.includes(role)
    );
  }

  async Interpolate(string, params) {
    const names = Object.keys(params)
    const vals = Object.values(params)
    return new Function(...names, `return \`${string}\`;`)(...vals);
  }

  async changeCash(profile, providedAmount, type = 'wallet', remove = false) {

    let amount;
    amount = providedAmount;

    switch(type?.toLowerCase()) {
      case "bank": {
        if(remove) {
          if(profile?.Bank > amount) {
            await profile.updateOne({
              $inc: { Bank: -amount }
            });
          } else {
            await profile.updateOne({
              Bank: 0,
            });
          }

        } else {
          await profile.updateOne({
            $inc: { Bank: amount }
          });
        }

        break;
      }

      default: {

        if(remove) {
          if(profile?.Wallet > amount) {
            await profile.updateOne({
              $inc: { Wallet: -amount }
            });
          } else {
            await profile.updateOne({
              Wallet: 0,
            });
          }

        } else {
          await profile.updateOne({
            $inc: { Wallet: amount }
          });
        }
        break;
      }
    }
  }

  async changeInventoryItem(profile, itemName, amount = 1, remove = false) {
    const itemInfo = profile.Inventory.filter((i) => i.name === itemName)[0];
    if(itemInfo) {
      if(remove && itemInfo.amount - amount <= 0) {
        await profile.updateOne({
          $pull: { Inventory: itemInfo }
        });
      }
      const newAmount = {
        name: itemName,
        amount: !remove ? itemInfo.amount + amount : itemInfo.amount - amount
      }
      await profile.updateOne({
        $pull: { Inventory: itemInfo }
      });
      await profile.updateOne({
        $push: { Inventory: newAmount }
      });
    } else {
      await profile.updateOne({
        $push: {Inventory: {name: itemName, amount: amount }}
      });
    }
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
    return `Velocity_` + retVal;
  }

  validateMs(time) {
    let actualTime = 0;
    let magnitudes = time.split(/[sdmh]/).filter((word) => word != "");
    let typesOfTime = time.split(/[0-9]+/).filter((word) => word != "");

    if (
        magnitudes.length == typesOfTime.length &&
        -1 == time.search(/[abcefgijklnopqrtuvwxyz]/)
    ) {
      for (let i = 0; i < magnitudes.length; i++) {
        switch (typesOfTime[i]) {
          case "s":
            actualTime += magnitudes[i] * 1000;
            break;
          case "m":
            actualTime += magnitudes[i] * 60000;
            break;
          case "h":
            actualTime += magnitudes[i] * 3600000;
            break;
          case "d":
            actualTime += magnitudes[i] * 86400000;
            break;
          default:
        }
      }
      return actualTime;
    }

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

  async roleHierarchy(guildID, memberID, targetID) {
    const guild = (await this.client.getRESTGuild(guildID));
    if(guild.ownerID === memberID) {
      return true;
    }
    const member = (await guild.getMember(memberID));
    const target = (await guild.getMember(targetID));
    const memberRole = this.getHighestRole(member, guild);
    const targetRole = this.getHighestRole(target, guild);
    if(!memberRole && targetRole) {
      return false;
    }
    if(memberRole && !targetRole && guild.ownerID !== targetID) {
      return true;
    }

    if (memberRole.position && targetRole.position) {
      return memberRole.position > targetRole.position;
    } else {
      return true;
    }
  }


  async getGuildSchema(guild) {

    const check = await guild_schema.findOne({ guildID: guild.id ?? guild });
    if (check) return check;
    const newSchema = new guild_schema({
      _id: Types.ObjectId(),
      guildID: guild.id,
      guildName: guild.name,
      prefix: "!",
    });

    await newSchema.save();

    return newSchema;
  }

  async getProfileSchema(userID) {
    const check = await profile_schema.findOne({ User: userID });
    if (check) return check;
    const newSchema = new profile_schema({
      _id: Types.ObjectId(),
      User: userID,
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
    if (!type) throw new TypeError(`No type provided.`);
    const locatedGuild = await guild_schema.findOne({ guildID: guild.id });
    if (!locatedGuild) return null;
    let locatedType = locatedGuild.Logging[type];
    if (!locatedType) return null;
    return locatedType ? this.client.getRESTChannel(locatedType) as Promise<TextChannel> : null;
  }

  async runPreconditions(interaction, member, g, command: Command) {
    if (command.guildOnly) {
      if (!interaction.guildID) {
        let noGuild = new this.client.embed()
            .setTitle(`Guild Only!`)
            .setDescription(`This Command can only be ran in a Guild!`)
            .setColor(`#F00000`)
            .setTimestamp()
            .setFooter(`Velocity`, this.client.user.avatarURL);
        return interaction.createFollowup({
          embeds: [noGuild]
        });
      }
    }

    if(!interaction.guildID) return;

    const guild = await this.client.guilds.get(g.id);
    if (command.devOnly) {
      if (!this.client.owners.includes(interaction.user ? interaction.user.id : interaction.member.id)) {
        let notOwnerEmbed = new this.client.embed()
          .setTitle(`Developer Only Command!`)
          .setDescription(`Only a Bot Developer can run this Command!`)
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Velocity`, this.client.user.avatarURL);

        return interaction.createFollowup({
          embeds: [notOwnerEmbed]
        });
      }
    }

    if (!guild) return;

    if (command.modCommand) {
      if (!(await this.checkModerator(member, guild))) {
        let noMod = new this.client.embed()
          .setTitle(`Moderator Only!`)
          .setDescription(`This Command requires you to be a Moderator!`)
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Velocity`, this.client.user.avatarURL);

        return interaction.createFollowup({
          embeds: [noMod]
        });
      }
    }

    if (command.botPerms.length) {
      const getMember = await guild.members.get(
        this.client.user.id
      );


      const checkBotPerms = command.botPerms.some((perm) => !getMember.permissions.has(perm));
      if (checkBotPerms) {
        let noPermEmbed = new this.client.embed()
          .setTitle(`Missing Permissions!`)
          .setDescription(
            `I am missing one of the required permissions for this Command. Required Permissions: ${command.botPerms.map((m) => this.cleanPerms(m)).join(", ")}`
          )
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Velocity`, this.client.user.avatarURL);

        return interaction.createFollowup({
          embeds: [noPermEmbed]
        });
      }
    }
    if (command.userPerms.length && !(await this.checkModerator(member, guild))) {
      const userPermCheck = command.userPerms.some((perm) => !member.permissions.has(perm));
      if (userPermCheck) {
        let noPermEmbed = new this.client.embed()
          .setTitle(`Missing Permissions!`)
          .setDescription(
            `You are missing one of the required permissions for this Command. Required Permissions: ${command.userPerms.map((m) => this.cleanPerms(m)).join(", ")}`
          )
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Velocity`, this.client.user.avatarURL);

        return interaction.createFollowup({
          embeds: [noPermEmbed]
        });
      }
    }
    if(command.premiumOnly && interaction?.guildID) {
      const check = (await this.checkPremium(interaction.guildID));
      if(!check) {
        let noPremiumEmbed = new this.client.embed()
            .setTitle(`Premium Only!`)
            .setDescription(`You must have Velocity Premium activated in order to use this Command! You can get it [here](https://vade-bot.com/premium)`)
            .setColor('#F00000')
            .setURL('https://vade-bot.com/premium')
            .setTimestamp()
            .setThumbnail(this.client.user.avatarURL)

        return interaction.createFollowup({
          embeds: [noPremiumEmbed]
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

  async hasVoted(user: string) {
    await this.client.redis.get(`votes.top.gg.${user}`, function (err, result) {
      return !!result;
    })
  }

  async checkPremium(guildID): Promise<Boolean> {
    const guildSchema = (await this.getGuildSchema(guildID));
    if (!guildSchema) return false;
    return !!guildSchema.Premium.active;

  }


  async giveawayEnded(giveaway) {

    console.log('Giveaway event fired.')

    let winner = [];

    if (!giveaway.entrants?.length) {
      const endEmbed = new this.client.embed()
        .setTitle(`🎉 Giveaway Ended! 🎉`)
        .setColor('#F00000')
        .setTimestamp()
        .setDescription(`Ended: <t:${Math.floor(Date.now() / 1000)}:f>\nHosted By: ${giveaway.giveawayHost}`)
        .addField(`Prize`, `${giveaway.prize}`)
        .addField(`Winner`, `No valid participants.`)
        .setThumbnail(this.client.user.avatarURL)

      this.client.editMessage(giveaway.channelID, giveaway.messageID, {
        // @ts-ignore
        embeds: [endEmbed], components: [{
          type: 1,
          components: [
            {
              type: 2,
              style: 3,
              label: `Enter!`,
              custom_id: `giveaway#enter`,
              disabled: true,
              emoji: {
                id: this.client.constants.emojis.giveaway.id,
                name: this.client.constants.emojis.giveaway.name,
                animated: false
              },
            }
          ]
        }
        ]
      }).catch(() => null);
      await giveaway.delete();
      return;
    }
    while (!winner.length || winner?.length < giveaway.winners) {
      const rand = Math.floor(Math.random() * (giveaway.entrants?.length - 0))
      const winnerID = giveaway.entrants[rand];
      let e = (await this.client.getRESTGuildMember(giveaway.guildID, winnerID));
      giveaway.entrants.splice(rand, 1);
      if (e) winner.push(e)
    }


    const endEmbed = new this.client.embed()
      .setTitle(`🎉 Giveaway Ended! 🎉`)
      .setColor('#F00000')
      .setTimestamp()
      .setDescription(`Ended: <t:${Math.floor(Date.now() / 1000)}:f>\nHosted By: ${giveaway.giveawayHost}`)
      .addField(`Prize`, `${giveaway.prize}`)
      .addField(`Winner(s)`, `${winner.map((u) => u.mention)?.join(", ")}`)
      .setThumbnail(this.client.user.avatarURL)

    // @ts-ignore
    console.log(giveaway)
    this.client.editMessage(giveaway.channelID, giveaway.messageID, {
      embeds: [endEmbed], components: [{
        type: 1,
        components: [
          {
            type: 2,
            style: 3,
            label: `Enter!`,
            custom_id: `giveaway#enter`,
            disabled: true,
            emoji: {
              id: this.client.constants.emojis.giveaway.id,
              name: this.client.constants.emojis.giveaway.name,
              animated: false
            },
          }
        ]
      }
      ]
    });
    const channel = (await this.client.getRESTChannel(giveaway.channelID))!!;
    channel ? channel.createMessage({ content: `${winner.map((u) => u.mention)?.join(", ")}, ${winners.size > 1 ? 'have won the giveaway!' : 'has won the giveaway!'}`, messageReference: { messageID: giveaway.messageID} }) : null;
    await giveaway.delete();

  }

  async antiScam(msg): Promise<boolean> {
    const scamRegex = !!scamLinks.find((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(msg.content);
    });
    if(scamRegex) {
      msg.delete();
      msg.channel.createMessage(`${msg.member.mention} attempted to send a phishing link!`);
      return true;
    } else {
      return false;
    }
  }

  async remind(reminderData) {
    console.log(`Reminder function fired`)
    const user = (await this.client.getRESTUser(reminderData?.userID));
    if (user) {
      const embed = new this.client.embed()
        .setAuthor(`You have a reminder!`, user.avatarURL)
        .setDescription(`> ${reminderData?.reminder}`)
        .setColor(this.client.constants.colours.green)
        .setTimestamp()
        .setFooter(`Velocity Utilities`, this.client.user.avatarURL)

      await user.getDMChannel().then((channel) => {
        channel.createMessage({ embeds: [embed] }).catch(() => null);
      });

      await reminderData.delete();
    } else {
      await reminderData.delete();
    }
  }

  msToTime(s) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    s = (s - mins) / 60;
    let hrs = s % 24;
    s = (s - hrs) / 24;
    let days = s % 133225;

    if (days != 0)
      return days + ` day${days === 1 ? " " : "s "}` + hrs + "h " + mins + "m";
    else return hrs + ` hour${hrs === 1 ? " " : "s "}` + mins + "m " + secs + "s";
  }
  getFlags(args: string[]): { flag: string; index: number }[] {
    const set = new Set();
    const res: { flag: string; index: number }[] = [];
    args.forEach((arg, index) => {
      if (!/^--?\w+$/.test(arg)) return;

      if (/^-\w+$/.test(arg)) {
        const flags = arg
            .slice(1)
            .split("")
            .map((flag) => {
              if (set.has(flag)) return;

              set.add(flag);

              return {
                flag,
                index,
              };
            })
            .filter(($) => !!$);

        //@ts-ignore
        res.push(...flags);
      } else if (/^--\w+$/.test(arg)) {
        const flag = arg.slice(2);

        if (set.has(flag)) return;

        set.add(flag);

        res.push({
          flag,
          index,
        });
      } else throw new TypeError(`Invalid flag format: '${arg}'`);
    });
    return res;
  }

  async muteEnded(muteData, msg = true) {
    const guild = (await this.client.getRESTGuild(muteData.guildID));
    if(!guild) return;
    const member = (await guild.getRESTMember(muteData.userID));
    if(!member) return;
   await member.edit({
      roles: muteData.roles
    }).catch((e) => {
     if(e) return;
   });
   if(msg) {


     const logChannel = await this.loggingChannel(guild, 'moderation');

     const embed = new this.client.embed()
         .setAuthor(`${member.username}#${member.discriminator}`, member.user.avatarURL)
         .setTitle(`${this.client.constants.emojis.moderation.mention} Mute Expired`)
         .setDescription(`**Member:** ${member.mention}`)
         .setColor(this.client.constants.colours.green)
         .setThumbnail(member.user.avatarURL)
         .setFooter(`Velocity Logging System`)
         .setTimestamp()

     logChannel ? logChannel?.createMessage({embeds: [embed]}) : null;

   }

  }
}
