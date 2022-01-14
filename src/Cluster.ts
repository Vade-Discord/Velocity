import { ClusterManager } from "@nedbot/sharder";
import { Bot } from "./Client/Client";
import launch from "./Launch";
import {resolve} from "path"

const manager = new ClusterManager("ODYzNTUwMjU3NzkwNTgyODQ2.YOoh2Q.iYmPzpd1khX1iW5N1MvgLoi9dCg", "dist/Launch", {
    client: Bot,
    shardCount: 1,
    clusterCount: 1,
    guildsPerShard: 1200,
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
