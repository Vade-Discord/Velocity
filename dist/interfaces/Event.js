"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor(client, name, options = {}) {
        this.type = "on";
        this.name = name;
        this.client = client;
        this.type = options.once ? "once" : "on";
        this.emitter =
            (typeof options.emitter === "string"
                ? this.client[options.emitter]
                : options.emitter) || this.client;
    }
    async run(...args) {
        throw new Error(`The run method has not been implemented in ${this.name}`);
    }
}
exports.Event = Event;
;
