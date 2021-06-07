"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("eris");
const config_json_1 = __importDefault(require("./config.json"));
const Client_1 = require("./client/Client");
process.on("unhandledRejection", (err) => {
    console.log(err);
});
new Client_1.Bot({}).start(config_json_1.default);
