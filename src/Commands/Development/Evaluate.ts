import Command from "../../Interfaces/Command";
import { Type } from "@extreme_hero/deeptype";
import { inspect } from "util";

export default class EvaluateCommand extends Command {
    constructor(client) {
        super(client, 'evaluate', {
            aliases: [""],
            description: "Evaluate the provided code.",
            category: "Development",
            devOnly: true,
            options: [
                {
                    type: 3,
                    name: 'code',
                    description: `The code to evaluate.`,
                    required: true,
                }
            ],
        });
    }
    async run(interaction, member) {

        const embed = new this.client.embed();
        const c = interaction.data.options[0].value;
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

            return interaction.createFollowup({embeds: [embed]});
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

            return interaction.createFollowup({embeds: [embed]});
        }

        embed.setDescription("No output.").addField("Information", info.toString());

        return interaction.createFollowup({embeds: [embed]});
    }

}
