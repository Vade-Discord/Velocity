"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Interfaces/Command"));
class TrustCommand extends Command_1.default {
    constructor(client) {
        super(client, 'checktrust', {
            description: "Check the trust of another individual!",
            category: "Information",
        });
    }
    async run(message, args) {
    }
}
exports.default = TrustCommand;
