import Koa from "koa";
import Body from "koa-body";
import { Logger } from "@dimensional-fun/logger";

import { votes } from "./routers/votes";
import { main } from "./routers/main";

import type { Bot } from "../Client/Client";

export class API {
    static PORT = 3003;

    readonly bot: Bot;

    koa: Koa;

    private log: Logger = new Logger("api");

    constructor(bot: Bot) {
        this.bot = bot;
        this.koa = new Koa();
        this.koa.use(Body({ json: true }));
    }

    start() {
        this.koa.use(votes(this).middleware());
        this.koa.use(main().middleware());

        this.koa.listen(API.PORT, () =>
            this.log.info(`Now listening on port ${API.PORT}`)
        );
    }
}