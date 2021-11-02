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

export function votes(api: API): Router {
    const router = new Router({ prefix: "/votes" });

    router.post("/top-gg", async (ctx: Koa.Context) => {
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


            console.log(`User with ID ${body.user} voted for the bot!`);
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