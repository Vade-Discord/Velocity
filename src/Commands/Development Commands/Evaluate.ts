import Command from '../../interfaces/Command';
import { Type } from "@extreme_hero/deeptype";
import { inspect } from "util";
import { RichEmbed } from 'eris';

export default class EvalCommand extends Command {
    constructor(client) {
        super(client, 'eval', {
            aliases: ["evaluate", "eval"],
            description: "Evaluate the given code.",
            category: "Development",
            devOnly: true,
        });
    }
    async run(message, args) {
        const msg = message,
            embed = new RichEmbed();

        let code = args.join(" ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
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

            return msg.channel.createMessage({embed: embed});
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

            return message.channel.createMessage({embed: embed});
        }

        embed.setDescription("No output.").addField("Information", info.toString());

        return message.channel.createMessage({embed: embed});

    }

}