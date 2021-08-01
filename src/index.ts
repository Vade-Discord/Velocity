import Config from "./config.json";
import { Bot } from "./client/Client";

process.on("unhandledRejection", (err) => {
    console.log(err)
})

new Bot({}).start(Config);