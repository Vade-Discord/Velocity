import Command from "../../Interfaces/Command";
import keyStorage from "../../Schemas/Premium-Schemas/KeyStorage";
import Eris, {TextChannel} from "eris";
import { Type } from "@extreme_hero/deeptype";
import { inspect } from "util";
import { Types } from 'mongoose';
import ms from 'ms';
import humanize from 'humanize-duration';
import profileSchema from '../../Schemas/User Schemas/Profile';

export default class EvaluateCommand extends Command {
    constructor(client) {
        super(client, 'dev', {
            aliases: [""],
            description: "Dev commands.",
            category: "Development",
            devOnly: true,
            options: [
                {
                    type: 1,
                    name: 'eval',
                    description: `Evaluate the provided code.`,
                    options: [
                        {
                            type: 3,
                            name: 'code',
                            description: `The code to evaluate.`,
                            required: true,
                        }
                    ],
                },
                {
                    type: 1,
                    name: 'update',
                    description: `Publish an update to the Bot. Notifies the newsletter subscribers alongside the changelog.`,
                    options: [
                        {
                            type: 3,
                            name: 'added',
                            description: `What has been added.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'version',
                            description: `The new version number`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'removed',
                            description: `What has been removed.`,
                            required: false,
                        },
                        {
                            type: 5,
                            name: 'newsletter',
                            description: `Should this notify the newsletter subscribers?`,
                            required: false,
                        }
                    ],
                },
                {
                    type: 1,
                    name: 'emit',
                    description: `Emit an event directly through the bot.`,
                    options: [
                        {
                            type: 3,
                            name: 'event',
                            description: `The event to emit.`,
                            required: true,
                        }
                    ],
                },
                {
                    type: 1,
                    name: 'generate-key',
                    description: `Generate a premium key.`,
                    options: [
                        {
                            type: 3,
                            name: 'duration',
                            description: 'The duration of the premium that the key will grant.',
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'say',
                    description: `Have the Bot say whatever you like.`,
                    options: [
                        {
                            type: 3,
                            name: 'text',
                            description: `The text you would like it to send.`,
                            required: true,
                        },
                        {
                            type: 7,
                            name: 'channel',
                            description: `The channel to send the text to. (Defaults to current)`,
                            required: false,
                        },
                    ],
                },
            ],
        });
    }
    async run(interaction, member, options, subOptions) {

        switch (interaction.data.options[0].name) {

            case "eval": {
                const embed = new this.client.embed();
                const c = subOptions.get("code");
                let code = c.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

                if (code.includes("await")) {
                    code = `(async () => {${code}})()`;
                }

                let evaluated, time, asyncTime;
                try {
                    const start = process.hrtime();

                    evaluated = eval(code);
                    if (evaluated instanceof Promise) {
                        const _start = process.hrtime();
                        evaluated = await evaluated;
                        asyncTime = process.hrtime(_start);
                    }

                    time = process.hrtime(start);
                } catch (err) {
                    embed
                        .setColor("#F00000")
                        .setDescription(`I ran into an error: \`\`\`js\n${err}\n\`\`\``);

                    return interaction.createFollowup({ embeds: [embed] });
                }

                time = (time[0] * 1e9 + time[1]) / 1e6;
                if (asyncTime) {
                    asyncTime = (asyncTime[0] * 1e9 + asyncTime[1]) / 1e6;
                }

                const info = [
                    `**Time**: *${time}ms* ${asyncTime ? `(async *${asyncTime} ms*)` : ""}`,
                ];

                if (evaluated) {
                    info.push(`**Type**: \`\`\`ts\n${new Type(evaluated).is}\n\`\`\` `);
                    if (typeof evaluated !== "string") {
                        evaluated = inspect(evaluated, {
                            depth: 0,
                        });
                    }

                    const esc = String.fromCharCode(8203);
                    evaluated = evaluated
                        .replace(/`/g, `\`${esc}`)
                        .replace(/@/g, `@${esc}`)
                        .replace(new RegExp(this.client.token, "gi"), '"**redacted**"');

                    if (evaluated.length >= 1000) {
                        evaluated = evaluated.substr(0, 1000);
                        evaluated += "...";
                    }

                    embed
                        .addField("Evaluated", ` \`\`\`js\n${evaluated}\n\`\`\` `)
                        .addField("Information", info.toString());

                    return interaction.createFollowup({ embeds: [embed] });
                }

                embed.setDescription("No output.").addField("Information", info.toString());

                return interaction.createFollowup({ embeds: [embed] });
            }

            case "emit": {
                const event = subOptions.get("event");

                switch (event?.toLowerCase()) {
                    case "guildmemberadd": {
                        this.client.emit('guildMemberAdd', member.guild, member);
                        break;
                    }

                    case "guildcreate": {
                        this.client.emit('guildCreate', member.guild);
                        break;
                    }
                    case "guilddelete": {
                        this.client.emit('guildDelete', member.guild);
                        break;
                    }
                }

                return interaction.createFollowup(`Successfully emit *${event}*.`);
            }

            case "generate-key": {
               const length = this.client.utils.validateMs(subOptions.get("duration"));
               if(!length) {
                   return interaction.createFollowup(`Time inputted incorrectly.`);
               }
                if(length > ms('360d')) {
                    return interaction.createFollowup({ content: `The key shouldn't last longer than one year.` });

                }

                const key = this.client.utils.generateKey();
                const newSchema = new keyStorage({
                    _id: Types.ObjectId(),
                    key,
                    expirationTime: Date.now() + length,
                    length: length,
                    createdBy: member.id,
                    createdOn: Date.now(),
                });

                await newSchema.save();

                interaction.createFollowup(`Here is the generated key with an expiration time of \`${humanize(length)}\`\n\n\`${key}\``);
                break;
            }

            case "update": {

                const updateChannelID = this.client.config.PRIVATE.update_log;
                const updateChannel = (await this.client.getRESTChannel(updateChannelID));
                const botUpdates = this.client.config.ROLES.update_ping;
                if(updateChannel.type !== 0 && updateChannel.type !== 5) return;
                const added = subOptions.get("added");
                const removed = subOptions.get("removed");
                const version = subOptions.get("version");
                const text = `<@&${botUpdates}> Version \`${version}\` released by **${member.username}#${member.discriminator}**\`\`\`diff\nAdded: \n\n ${added.split("+")?.join("\n+")} \n\n${removed ? `Removed: \n\n ${removed.split("-")?.join("\n-")}` : ''}\`\`\``;
                updateChannel ? updateChannel.createMessage(text) : null;

                interaction.createFollowup(`Successfully published the update!`);
                const newsletterSubscribers = (await profileSchema.find({ Newsletter: true }));
                newsletterSubscribers.forEach(async (subscriber) => {
                    const user = await this.client.getRESTUser(subscriber.userID);
                    if(!user) {
                        return;
                    } else {
                        await user.getDMChannel().then((c) => {
                            c.createMessage(`Version \`${version}\` released by **${member.username}#${member.discriminator}**\`\`\`diff\nAdded: \n\n ${added.split("+")?.join("\n+")} \n\n${removed ? `Removed: \n\n ${removed.split("-")?.join("\n-")}` : ''}\`\`\` \n\n**Unsubscribe from the Newsletter to stop getting these notifications.`).catch(() => {
                                console.log(`Unable to DM ${user.id} their Newsletter.`);
                            });
                        })
                    }

                });

                break;
            }

            case "say": {
                const text = subOptions.get("text");
                if (subOptions.get("channel")) {
                    const channelID = subOptions.get("channel");
                    const channel = this.client.getChannel(channelID);
                    if (channel) {
                        if (channel instanceof Eris.TextChannel) {
                            channel.createMessage(text);
                            return interaction.createFollowup(`Successfully sent!`);
                        } else {
                            return interaction.createFollowup(`Looks like either the channel was not located or it was not a text channel.`);
                        }
                    }
                } else {
                    return interaction.createFollowup(text);
                }
            }
        
        }
    }

}
