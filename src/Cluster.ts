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
            id: config.local ? "937824435505864794" : "930904091620700160",
            token: config.local ? "P1i7WIY0YniYRuGXZipfhp7EQnQpQ28JAXKSGKY_jTPdVlqr_y6NGmVcpocl_2eCX2xv" : "qWuK36GpB-ScnKWDCTA_DB3q0LPYIu2yBXiF1U7xdRmQSVclXNlrtMfYOJK3KJQRKunF"
        },
        cluster: {
            id: config.local ? "937824435505864794" : "930904091620700160",
            token: config.local ? "P1i7WIY0YniYRuGXZipfhp7EQnQpQ28JAXKSGKY_jTPdVlqr_y6NGmVcpocl_2eCX2xv" : "qWuK36GpB-ScnKWDCTA_DB3q0LPYIu2yBXiF1U7xdRmQSVclXNlrtMfYOJK3KJQRKunF"
        }
    }
});

// manager.on("stats", (x) => {
//     console.log(x);
// })
