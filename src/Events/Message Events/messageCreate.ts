import { Event } from '../../Interfaces/Event';
import { profanityArray } from '../../Assets/Profanity.json';
import {promisify} from "util";
import {distance} from "fastest-levenshtein";
const wait = promisify(setTimeout);

export default class MessagecreateEvent extends Event {
    constructor(client) {
        super(client, "messageCreate", {});
    }

    async run(message) {


        if (!message.content || !message.channel.guild) return;
        if (message.author.bot) return;
        if (message.member.permissions.has("manageMessages") || (await this.client.utils.checkModerator(message.member, message.channel.guild))) return;

        const guildData = (await this.client.utils.getGuildSchema(message.channel.guild))!!;
        const logChannel = (await this.client.utils.loggingChannel(message.channel.guild, 'moderation'));
        const tag = `${message.author.username}#${message.author.discriminator}`;
        const user = message.author;
        const logEmbed = new this.client.embed()
            .setAuthor(tag, user.avatarURL)
            .setDescription(`**User:** ${tag} (${message.author.id}) 
Time: <t:${Math.floor((Date.now()) / 1000)}:R>`)
            .setThumbnail(user.avatarURL)
            .setFooter(`Vade Logging System`)
            .setColor(`#F00000`)
            .setTimestamp();

        if (guildData?.Moderation?.antiProfanity) {
            const ignore = ['ok', 'alr'];
            const profanity = message.content.split(" ").filter((word) => word.length >= 4 && profanityArray.some((letter) => distance(letter, word) < 0.8));
            if (profanity.length) {
                message.delete().then(() => {
                    message.channel.createMessage(`${message.author.mention}, watch your language!`).then(async (msg) => {
                        await wait(5000);
                        if (message && !message.deleted) {
                            msg.delete();
                        }
                    });
                    logEmbed
                        .setTitle(`Profanity Filter triggered!`)

                    logChannel ? logChannel.createMessage({embeds: [logEmbed]}) : null;
                    return;
                });
            }
        }
        if (guildData?.Moderation?.antiLink) {
            if (/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm.test(message.content)) {
                message.delete().then(() => {
                    message.channel.createMessage(`${message.author.mention}, you cannot send links!`).then(async (msg) => {
                        await wait(5000);
                        if (message && !message.deleted) {
                            msg.delete();
                        }
                    });
                    logEmbed
                        .setTitle(`Anti-link triggered!`)

                    logChannel ? logChannel.createMessage({embeds: [logEmbed]}) : null;
                    return;
                });
            }


        }

        if (guildData?.Moderation?.antiInvite) {
            const Regex = new RegExp(`(https?:\\/\\/)?(www\\.)?((discordapp\\.com/invite)|(discord\\.gg))\\/(\\w+)`)

            if (Regex.test(message.content)) {
                message.delete().then(() => {
                    message.channel.createMessage(`${message.author.mention}, you cannot send invites!`).then(async (msg) => {
                        await wait(5000);
                        if (message && !message.deleted) {
                            msg.delete();
                        }
                    });
                    logEmbed
                        .setTitle(`Anti-Invite triggered!`)

                    logChannel ? logChannel.createMessage({embeds: [logEmbed]}) : null;
                    return;
                });
            }

        }

    }

}