import { ClusterManager } from "@nedbot/sharder";
import { Bot } from "./client/Client";
import config from './config.json';

const manager = new ClusterManager(config.token, "index.js", {
    client: Bot,
    shardCount: 1,
    clusterCount: 1,
    guildsPerShard: 1200,
    shardsPerCluster: 10,
    clusterTimeout: 5000,
    statsUpdateInterval: 10000,
    clientOptions: {
        messageLimit: 180
    },
    loggerOptions: {
        logFileDirectory: "logs",
        enableErrorLogs: true,
        enableInfoLogs: true
    },
});