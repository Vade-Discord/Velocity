"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const logger_1 = require("@dimensional-fun/logger");
const eris_1 = __importDefault(require("eris"));
const pluris_1 = __importDefault(require("pluris"));
const collection_1 = __importDefault(require("@discordjs/collection"));
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
const config_json_1 = __importDefault(require("../config.json"));
const Util_1 = __importDefault(require("../Interfaces/Util"));
const globPromise = util_1.promisify(glob_1.default);
pluris_1.default(eris_1.default);
class Bot extends eris_1.default.Client {
    constructor(options = {}) {
        super(config_json_1.default.token);
        this.logger = new logger_1.Logger("vade");
        this.commands = new collection_1.default();
        this.token = config_json_1.default.token;
        this.aliases = new collection_1.default();
        this.categories = new Set();
        this.events = new collection_1.default();
        this.cooldowns = new collection_1.default();
        this.owners = ["473858248353513472"];
        this.utils = new Util_1.default(this);
        if (Bot.__instance__)
            throw new Error("Another client was created.");
        Bot.__instance__ = this;
    }
    async start(config) {
        this.logger.info("hi");
        this.config = config;
        await this.connect();
        /* load command files */
        const commandFiles = await globPromise(`${__dirname}/../Commands/**/*{.ts,.js}`);
        commandFiles.map(async (value) => {
            const file = new ((await Promise.resolve().then(() => __importStar(require(value)))).default)(this);
            this.commands.set(file.name, file);
            this.categories.add(file.category);
            if (file.aliases?.length) {
                file.aliases.map((value) => this.aliases.set(value, file.name));
            }
        });
        const eventFiles = await globPromise(`${__dirname}/../events/**/*{.ts,.js}`);
        eventFiles.map(async (value) => {
            const file = await Promise.resolve().then(() => __importStar(require(value)));
            this.events.set(file.name, file);
            this.on(file.name, file.run.bind(null, this));
        });
    }
    static get instance() {
        return Bot.__instance__;
    }
}
exports.Bot = Bot;
