import Router from "@koa/router";

import type Koa from "koa";

export function main(): Router {
    const router = new Router();

    router.get("/", (ctx: Koa.Context) => {
        ctx.body = { success: true, message: "hello!" };
    });

    return router;
}