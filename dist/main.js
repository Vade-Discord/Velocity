"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharder_1 = require("@nedbot/sharder");
const Client_1 = require("./client/Client");
const config_json_1 = __importDefault(require("./config.json"));
const manager = new sharder_1.ClusterManager(config_json_1.default.token, "index.js", {
    client: Client_1.Bot,
    shardCount: "auto",
    clusterCount: "auto",
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
