import Router from "@koa/router";
import joi from "joi";

import type Koa from "koa";
import type { API } from "../API";

const topGG = joi.object<TopGG>({
    bot: joi.string().required(),
    user: joi.string().required(),
    type: joi.string().regex(/upvote|test/i),
    isWeekend: joi.boolean().required(),
    query: joi.string().optional(),
});

const discordBoats = joi.object<DiscordBoats>({
    "bot": {
        id: joi.string().required(),
        name: joi.string().required()
    },
    "user": {
        id: joi.string().required(),
        username: joi.string().required(),
        discriminator: joi.number().required()
    }
});

export function votes(api: API): Router {
    const router = new Router({ prefix: "/votes" });

    router.post("/top-gg", async (ctx: Koa.Context) => {
        api.bot.logger.info("API Request from Top.gg");
        const auth = ctx.header.authorization;
        if (!auth || auth !== api.bot.config.API.TOPGG_AUTH) {
            ctx.status = 401;
            ctx.body = { success: false, message: "incorrect authorization" };
            return;
        }

        const body: TopGG = ctx.request.body;
        try {
            await topGG.validate(body);
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                errors: error.errors,
                message: error.message,
            };

            return;
        }
      await api.bot.redis.set(`votes.top.gg.${body.user}`, true, 'EX', 43200);
        try {


            console.log(`User with ID ${body.user} voted for the bot! [TOP.GG]`);
            const user = (await api.bot.getRESTUser(body.user));
            const logChannelID = api.bot.config.PRIVATE.vote_log;
            const channel = (await api.bot.getRESTChannel(logChannelID));
            if (channel?.type === 0) {
                const embed = new api.bot.embed()
                    .setDescription(`${user.username}#${user.discriminator} (\`${body.user}\`) has voted for **Velocity**! Vote for us **[HERE](https://top.gg/bot/850723996513075200/vote)**!`)
                    .setColor(api.bot.constants.colours.green)
                    .setTimestamp()
                    .setFooter(`Velocity | Vote Logging`)

                channel ? channel.createMessage({embeds: [embed]}) : null;
                const profile = (await api.bot.utils.getProfileSchema(user.id))!!;
                await api.bot.utils.changeCash(profile, 1000);
                await user.getDMChannel().then((c) => {
                    let thanksEmbed = new api.bot.embed()
                        .setDescription(`Thanks for voting on **top.gg**, take **$1,000** as a reward! Check your balanace via \`/bank balance\`! Also vote **[HERE](https://discord.boats/bot/850723996513075200/vote)** for more rewards!`)
                        .setColor(api.bot.constants.colours.green)
                        .setTimestamp()
                        .setFooter(`Velocity | Vote Logging`)

                    c.createMessage({ embeds: [thanksEmbed] }).catch(() => null);
                });
            }
        } catch (e) {
            api.bot.logger.error('API ERROR: ', e);
        }
    });

    router.post("/discord-boats", async (ctx: Koa.Context) => {
        api.bot.logger.info("API Request from Discord.boats");
        const body: DiscordBoats = ctx.request.body;
        try {
            await discordBoats.validate(body);
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                errors: error.errors,
                message: error.message,
            };

            return;
        }
        await api.bot.redis.set(`votes.discord-boats.${body.user.id}`, true, 'EX', 43200);
        try {

            console.log(`User with ID ${body.user.id} voted for the bot! [DISCORD-BOATS]`);
            const user = (await api.bot.getRESTUser(body.user.id));
            const logChannelID = api.bot.config.PRIVATE.vote_log;
            const channel = (await api.bot.getRESTChannel(logChannelID));
            if (channel?.type === 0) {
                const embed = new api.bot.embed()
                    .setDescription(`${user.username}#${user.discriminator} (\`${body.user.id}\`) has voted for **Velocity** on **Discord Boats**! Vote for us **[HERE](https://discord.boats/bot/850723996513075200/vote)**!`)
                    .setColor(api.bot.constants.colours.green)
                    .setTimestamp()
                    .setFooter(`Velocity | Vote Logging`)

                channel ? channel.createMessage({embeds: [embed]}) : null;
                const profile = (await api.bot.utils.getProfileSchema(user.id))!!;
                await api.bot.utils.changeCash(profile, 1000);
                await user.getDMChannel().then((c) => {
                    let thanksEmbed = new api.bot.embed()
                        .setDescription(`Thanks for voting on **Discord Boats**, take **$1,000** as a reward! Check your balanace via \`/bank balance\`! Also vote **[HERE](https://top.gg/bot/850723996513075200/vote)** for more rewards!`)
                        .setColor(api.bot.constants.colours.green)
                        .setTimestamp()
                        .setFooter(`Velocity | Vote Logging`)

                    c.createMessage({ embeds: [thanksEmbed] }).catch(() => null);
                });
            }
        } catch (e) {
            api.bot.logger.error('API ERROR: ', e);
        }
    });

    return router;
}

interface TopGG {
    bot: string;
    user: string;
    type: "upvote" | "test";
    isWeekend: boolean;
    query?: string;
}

interface DiscordBoats {
    "bot": {
        id: string,
        name: string
    },
    "user": {
        id: string,
        username: string,
        discriminator: number
    }
}