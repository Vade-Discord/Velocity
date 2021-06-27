import Command from "../../Interfaces/Command";
import keySchema from "../../Schemas/Premium Schemas/KeyStorage";
import guildSchema from "../../Schemas/Main Guilds/GuildSchema";
import { TextChannel } from 'eris';
import humanize from 'humanize-duration';

export default class RedeemCommand extends Command {
    constructor(client) {
        super(client, 'redeem', {
            aliases: ["coupon", "applycoupon"],
            description: "Redeem premium for your guild!",
            category: "Configuration",
            userPerms: ['manageGuild'],
        });
    }
    async run(message, args) {

        const { keylog, mainGuild } = this.client.config;
        const keyChannel = this.client.guilds.get(mainGuild)?.channels.get(keylog);
        if(keyChannel.type !== 0) return;

        if(!args.length) {
            return message.channel.createMessage({ content: `You need to provide a key that you wish to redeem!`, messageReference: { messageID: message.id }});
        }

        const checkKey = await keySchema.findOne({ key: args[0] });
        if(!checkKey) return message.channel.createMessage({ content: `Invalid key provided!`, messageReference: { messageID: message.id }});
        if(checkKey.expirationTime <= Date.now()) {
            message.channel.createMessage({ content: `That key has expired!`, messageReference: { messageID: message.id }});
            // Log the deleted key in the key-logs.


            let deletedEmbed = new this.client.embed()
                .setTitle(`Key Schema Deleted!`)
                .addField(`Key`, `\`${args[0]}\``)
                .addField(`Delete reason`, `The key has expired.`)
                .addField(`Guild`, `${message.channel.guild.name} (${message.channel.guild.id})`)
                .setFooter(`Vade | Key logging`)
                .setColor(`#F00000`)
                .setTimestamp();

            keyChannel ?  keyChannel?.createMessage({ embed: deletedEmbed }) : null;

        return;
        }

        let newGuild;
        const locateGuild = (await guildSchema.findOne({ guildID: message.guildID })) ?? await this.client.utils.createGuildSchema(message.channel.guild).then(async (guild) => {
            await guild.updateOne({
                Premium: {
                    key: args[0],
                    redeemedOn: Date.now(),
                    expiresOn: checkKey.expirationTime,
                    redeemedBy: message.author.id,
                    active: true,
                    stacked: false,
               }
            });
            newGuild = true;
            return message.channel.createMessage({ content: `Successfully activated premium for this server!`, messageReference: { messageID: message.id }});
        });

        if(newGuild) return;

        if(locateGuild?.Premium.active) {
            const currentTime = locateGuild.Premium.expiresOn;
            const newTime = currentTime + checkKey.length;
            await locateGuild.updateOne({
                Premium: {
                    key: checkKey.key,
                    redeemedOn: Date.now(),
                    expiresOn: newTime,
                    redeemedBy: message.author.id,
                    active: true,
                    stacked: true,
                }
            });

            let addedTimeEmbed = new this.client.embed()
                .setTitle(`Premium Time Added`)
                .addField(`Key`, `\`${args[0]}\``)
                .addField(`Time Added Reason`, `Another key was redeemed resulting in a stack forming.`)
                .addField(`Guild`, `${message.channel.guild.name} (${message.channel.guild.id})`)
                .setFooter(`Vade | Key logging`)
                .setColor(`#cefad0`)
                .setTimestamp();

            keyChannel ?  keyChannel?.createMessage({ embed: addedTimeEmbed }) : null;
            return message.channel.createMessage({ content: `Successfully added \`${humanize(checkKey.length)}\`to this guilds Premium Subscription`, messageReference: { messageID: message.id }});
        }

        await locateGuild.updateOne({
            Premium: {
                key: args[0],
                redeemedOn: Date.now(),
                expiresOn: checkKey.expirationTime,
                redeemedBy: message.author.id,
                active: true,
                stacked: false,
            }
        });
        message.channel.createMessage({ content: `Successfully activated premium for this server!`, messageReference: { messageID: message.id }});


     }

    }
