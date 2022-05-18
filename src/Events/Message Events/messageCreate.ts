import { Event } from '../../Interfaces/Event';
import { profanityArray } from '../../Assets/Profanity.json';
import { AntiPhishing } from '../../Classes/AntiPhishing';
import MassMention from '../../Classes/MassMention';
import { promisify } from 'util';
import messageSchema from '../../Schemas/Backend/Messages';
import { distance } from 'fastest-levenshtein';
import AntiEmoteSpam from '../../Classes/AntiEmoteSpam';
import tagSchema from '../../Schemas/Backend/Tags';
const wait = promisify(setTimeout);

export default class MessagecreateEvent extends Event {
  constructor(client) {
    super(client, 'messageCreate', {});
  }

  async run(message) {
    if (!message.content || !message.channel.guild) return;
    if (message.author.bot) return;

    const guildData = (await this.client.utils.getGuildSchema(
      message.channel.guild
    ))!!;

    if (guildData?.MessageCounter === true) {
      const messageData = await messageSchema.findOne({
        userID: message.author.id,
        guildID: message.channel.guild.id,
      });
      if (!messageData) {
        const newSchema = new messageSchema({
          userID: message.author.id,
          guildID: message.channel.guild.id,
          amount: 1,
        });
        await newSchema.save();
      } else {
        await messageData.updateOne({
          $inc: { amount: 1 },
        });
      }
    }

    const tagFound =  message?.content ? (await tagSchema.findOne({ guildID: interaction.guildID, tagName: message?.content })) : null;
    if(tagFound) {
      message.channel.createMessage({ content: tagFound.tagValue, messageReference: { messageID: message.id, failIfNotExists: false } });
    }

    if (
      !this.client.config.local &&
    message.member?.permissions.has('manageMessages') ||
    (await this.client.utils.checkModerator(
      message.member,
      message.channel.guild
    ))
  ) {
    return;
  } 

    const logChannel = await this.client.utils.loggingChannel(
      message.channel.guild,
      'moderation'
    );
    const tag = `${message.author.username}#${message.author.discriminator}`;
    const user = message.author;
    const logEmbed = new this.client.embed()
      .setAuthor(tag, user.avatarURL)
      .setDescription(
        `**User:** ${tag} (${message.author.id}) 
**Time:** <t:${Math.floor(Date.now() / 1000)}:R>`
      )
      .setThumbnail(user.avatarURL)
      .setFooter(`Velocity Logging System`)
      .setColor(`#F00000`)
      .setTimestamp();

    if (guildData?.Moderation["antiProfanity"]) {
      const ignore = ['ok', 'alr'];
      const clean = (str) => str.replace(/[^\w\s]/gi, '');
      const profanity = message.content
        ?.split(' ')
        .map((word) => clean(word))
        .filter(
          (word) =>
            word.length >= 4 &&
            profanityArray.some(
              (letter) => distance(letter, word?.toLowerCase()) < 0.8
            )
        );
      if (profanity.length) {
        message.delete().then(() => {
          message.channel
            .createMessage(`${message.author.mention}, watch your language!`)
            .then(async (msg) => {
              await wait(5000);
              if (message && !message.deleted) {
                msg.delete();
              }
            });
          logEmbed.setTitle(`Profanity Filter triggered!`);
          logEmbed.setDescription(`**User:** ${tag} (${message.author.id}) 
**Time:** <t:${Math.floor(Date.now() / 1000)}:R>
**Word:** ||${profanity[0]}||`);

          logChannel ? logChannel.createMessage({ embeds: [logEmbed] }) : null;
          return;
        });
      }
    }
    if (guildData?.Moderation["antiScam"]) {
      const result = await (new AntiPhishing(this.client)).Run(message);
      if (result.status) {
        logEmbed.setTitle(`Phishing link detected!`);
        logEmbed.setDescription(`**User:** ${tag} (${message.author.id}) 
**Time:** <t:${Math.floor(Date.now() / 1000)}:R>
**Link:** ||${result.link}||`);
        logChannel ? logChannel.createMessage({ embeds: [logEmbed] }) : null;
        await this.client.automod.AutoAction(
          message.member.guild.id,
          message.member,
          'phishing'
        );
      }
    }
    if (guildData?.Moderation["antiLink"]) {
      if (
        /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim.test(
          message.content
        )
      ) {
        message.delete().then(() => {
          message.channel
            .createMessage(`${message.author.mention}, you cannot send links!`)
            .then(async (msg) => {
              await wait(5000);
              if (message && !message.deleted) {
                msg.delete();
              }
            });
          logEmbed.setTitle(`Anti-link triggered!`);

          logChannel ? logChannel.createMessage({ embeds: [logEmbed] }) : null;
          return;
        });
      }
    }

    if (guildData?.Moderation["antiInvite"]) {
      const Regex = new RegExp(
        `(https?:\\/\\/)?(www\\.)?((discordapp\\.com/invite)|(discord\\.gg))\\/(\\w+)`
      );

      if (Regex.test(message.content)) {
        message.delete().then(async () => {
          message.channel
            .createMessage(
              `${message.author.mention}, you cannot send invites!`
            )
            .then(async (msg) => {
              await wait(5000);
              if (message && !message.deleted) {
                msg.delete();
              }
            });
          logEmbed.setTitle(`Anti-Invite triggered!`);

          logChannel ? logChannel.createMessage({ embeds: [logEmbed] }) : null;
          await this.client.automod.AutoAction(
            message.member.guild.id,
            message.member,
            'advertising'
          )

          return;
        });
      }
    }
    if (guildData?.Moderation["massMention"]) {
      let result: Boolean;
      result = (await (new MassMention(this.client)).run(message));
      if (result) {
        
        logEmbed.setTitle(`Mass-Mention triggered!`);
        logEmbed.setDescription(`**Sent By:** ${message.author.mention}`)
        logChannel ? logChannel.createMessage({ embeds: [logEmbed] }) : null;
        await this.client.automod.AutoAction(
          message.member.guild.id,
          message.member,
          'massmention'
        );
      }

    }
    if(guildData.Moderation.emoteSpam) {
      let result: any;
      result = (await (new AntiEmoteSpam(this.client)).run(message));
      if(result) {
        logEmbed.setTitle(`Anti-Emote-Spam triggered!`);
        logEmbed.setDescription(`**Sent By:** ${message.author.mention}`)
        logChannel ? logChannel.createMessage({ embeds: [logEmbed] }) : null;
        await this.client.automod.AutoAction(
          message.member.guild.id,
          message.member,
          'emotespam'
        );
      }
  }
  }
}
