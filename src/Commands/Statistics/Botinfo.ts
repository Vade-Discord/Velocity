import Command from "../../Interfaces/Command";
import { VERSION } from "eris";
import { utc } from "moment";
import { models } from 'mongoose';
import os from "os";
import ms from "ms";
const core = os.cpus()[0];

export default class BotinfoCommand extends Command {
    constructor(client) {
        super(client, 'botinfo', {
            aliases: [""],
            description: "Get information on the bot!",
            category: "Statistics",
        });
    }
    async run(interaction, member) {

        const Values = Object.values(models);

        const db = await Values.reduce(
            async (accumulator, model) => {
                const counts = await model.countDocuments();
                return (await accumulator) + counts;
            },
            Promise.resolve(0)
        );

        const embed = new this.client.embed()
            .setThumbnail(this.client.user.avatarURL)
            .setColor(
               this.client.constants.colours.turquoise
            )
            .addField("__General__",
                `**❯** Bot: **${this.client.user.username}#${this.client.user.discriminator} (${this.client.user.id})**
                **❯** Commands: **${this.client.commands.size}**
                **❯** Servers: **${this.client.guilds.size.toLocaleString()}**
                **❯** Users: **${this.client.guilds
                    .reduce((a, b) => a + b.memberCount, 0)
                    .toLocaleString()}**
                **❯** Database Entries: **${db}**
                **❯** Creation Date: **${utc(this.client.user.createdAt).format(
                    "Do MMMM YYYY HH:mm:ss"
                )}**
                **❯** Node.js: **${process.version}**
                **❯** Eris: **${VERSION}**
                **❯** Cluster ID: **${this.client.cluster.id}**`
            )
            .addField("__System__",
                `**❯** Platform: **${process.platform}**
                 **❯** Uptime: **${ms(os.uptime() * 1000, { long: true })}**`,
            )
            .addField("__CPU__",
                `**❯** Cores: **${os.cpus().length}**
                **❯** Model: **${core.model}**
                **❯** Speed: **${core.speed}MHz**`
            )
            .setTimestamp()
            .setAuthor(
                `Requested by ${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                interaction.member.user.avatarURL
            );

        interaction.createFollowup({ embeds: [embed]});

    }

}
