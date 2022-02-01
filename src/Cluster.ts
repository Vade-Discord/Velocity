import { ClusterManager } from "@nedbot/sharder";
import { Bot } from "./Client/Client";
import config from "./config.json";
import launch from "./Launch";
import {resolve} from "path"

const manager = new ClusterManager(config.token, "dist/Launch", {
    client: Bot,
    shardCount: config.ClusterConfig.shardCount,
    clusterCount: config.ClusterConfig.clusterCount,
    guildsPerShard: config.ClusterConfig.guildsPerShard,
    shardsPerCluster: 1,
    clusterTimeout: 5000,
    statsUpdateInterval: 2000,

    loggerOptions: {
        logFileDirectory: "logs",
        enableErrorLogs: true,
        enableInfoLogs: true
    },
    webhooks: {
        shard: {
            id: config.local ? config.webhooks.local.shardID : config.webhooks.main.shardID,
            token: config.local ? config.webhooks.local.shardToken : config.webhooks.main.shardToken
        },
        cluster: {
            id: config.local ? config.webhooks.local.clusterID : config.webhooks.main.clusterID,
            token: config.local ? config.webhooks.local.clusterToken : config.webhooks.main.clusterToken
        }
    }
});

// manager.on("stats", (x) => {
//     console.log(x);
// })
