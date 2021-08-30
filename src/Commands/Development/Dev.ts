import Command from "../../Interfaces/Command";
import guildSchema from "../../Schemas/Main Guilds/GuildSchema";
import Eris from "eris";
import { Type } from "@extreme_hero/deeptype";
import { inspect } from "util";

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
                    name: 'premium',
                    description: `Add premium to a server.`,
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

            case "premium": {
                const schema = await guildSchema.findOne({ guildID: interaction.guildID });
                if (schema) {
                    await schema.updateOne({
                        Premium: {
                            active: true,
                        },
                    });
                    return interaction.createFollowup(`Successfully added the premium!`);
                } else {
                    return interaction.createFollowup(`This guild doesn't have any data.`);
                }
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
