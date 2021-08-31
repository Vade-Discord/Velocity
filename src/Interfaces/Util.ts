import type { Bot } from "../client/Client";
import Command from "./Command";

// Package imports
import { RichEmbed } from "eris";
import { Types } from "mongoose";


// File imports
import guild_schema from "../Schemas/Main Guilds/GuildSchema";
import profile_schema from "../Schemas/User Schemas/Profile";
import GiveawaySchema from "../Schemas/Backend/Giveaways";
import ReminderSchema from "../Schemas/Backend/Reminders";

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

  async getGuildSchema(guild) {
    const check = await guild_schema.findOne({ guildID: guild.id });
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
    return locatedType ? guild.channels.get(locatedType) : null;
  }

  async roleHierarchy(guildID, memberID, targetID) {
    const guild = await this.client.getRESTGuild(guildID)
    const member = await guild.getRESTMember(memberID)
    const target = await guild.getRESTMember(targetID)
    const memberRole = this.getHighestRole(member, guild);
    const targetRole = this.getHighestRole(target, guild);
    if (memberRole && targetRole) {
      return memberRole.position > targetRole.position;
    } else {
      return true;
    }
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
        let noPermEmbed = new RichEmbed()
          .setTitle(`Missing Permissions!`)
          .setDescription(
            `I am missing one of the required permissions for this Command. Required Permissions: ${command.botPerms.map((m) => this.cleanPerms(m)).join(", ")}`
          )
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Vade`, this.client.user.avatarURL);

        return interaction.createFollowup({
          embeds: [noPermEmbed]
        });
      }
    }
    if (command.userPerms.length) {
      const userPermCheck = command.userPerms.some((perm) => !member.permissions.has(perm));
      if (userPermCheck) {
        let noPermEmbed = new RichEmbed()
          .setTitle(`Missing Permissions!`)
          .setDescription(
            `You are missing one of the required permissions for this Command. Required Permissions: ${command.userPerms.map((m) => this.cleanPerms(m)).join(", ")}`
          )
          .setColor(`#F00000`)
          .setTimestamp()
          .setFooter(`Vade`, this.client.user.avatarURL);

        return interaction.createFollowup({
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
    const guildSchema = await guild_schema.findOne({ guildID });
    if (!guildSchema) return false;
    return !!guildSchema?.Premium?.active;

  }


  async giveawayEnded(giveaway) {

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
    await this.client.editMessage(giveaway.channelID, giveaway.messageID, {
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
    })
    await giveaway.delete();

  }

  async remind(reminderData) {
    const user = (await this.client.getRESTUser(reminderData?.userID));
    if (user) {
      const embed = new this.client.embed()
        .setAuthor(`You have a reminder!`, user.avatarURL)
        .setDescription(`> ${reminderData?.reminder}`)
        .setColor(this.client.constants.colours.green)
        .setTimestamp()
        .setFooter(`Vade Utilities`, this.client.user.avatarURL)

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

}
