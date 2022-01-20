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
            id: "930904091620700160",
            token: "qWuK36GpB-ScnKWDCTA_DB3q0LPYIu2yBXiF1U7xdRmQSVclXNlrtMfYOJK3KJQRKunF"
        },
        cluster: {
            id: "930904091620700160",
            token: "qWuK36GpB-ScnKWDCTA_DB3q0LPYIu2yBXiF1U7xdRmQSVclXNlrtMfYOJK3KJQRKunF"
        }
    }
});

// manager.on("stats", (x) => {
//     console.log(x);
// })
