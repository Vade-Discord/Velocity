import Command from "../../Interfaces/Command";
import Eris from "eris";
import phin from 'phin';

export default class BannerCommand extends Command {
    constructor(client) {
        super(client, 'banner', {
            aliases: [""],
            description: "Check out a users banner!",
            category: "Main",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: `The person who's avatar you would like to see.`,
                    required: true,
                }
            ],
        });
    }
    async run(interaction, member) {
         if(!interaction.data.resolved.users) await interaction.data.users.resolve();
        const user = interaction.data.options?.filter(m => m.name === "user")[0].value;
        if(user) {
            const url = `https://discord.com/api/v8/users/${user}`;
            const { body } = await phin({url: url, parse: "json", headers: { Authorization: `Bot ${this.client.config.token}` }});
            // @ts-ignore
            const banners = {
                gif: `https://cdn.discordapp.com/banners/${user}/${body?.banner}.gif?size=1024`,
                png: `https://cdn.discordapp.com/banners/${user}/${body?.banner}.png?size=1024`,
                none: null
            }

            const embed = new this.client.embed()
                .setAuthor(`${body.username}'s Banner`)
                .setTimestamp()

            if (body?.banner?.startsWith("a_")) {
                return interaction.createFollowup({ embeds: [ embed.setImage(banners.gif)]});
            } else if(body?.banner) {
                return interaction.createFollowup({ embeds: [ embed.setImage(banners.png)]});
            } else {
                return interaction.createFollowup(`Could not locate a banner for that user.`);
            }

        } else {
            return interaction.createFollowup(`Oops! Looks like you didn't provide a user!`);
        }

    }

}
