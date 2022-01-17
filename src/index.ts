import Config from "./config.json";
import { Bot } from "./client/Client";

process.on("unhandledRejection", (err) => {
    console.log(err)
})

// @ts-ignore
new Bot({intents: []}).start(Config);