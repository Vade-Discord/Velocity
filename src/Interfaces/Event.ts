import type { Bot } from "../client/Client";

interface EventOptions {
    once?: boolean;
    emitter?: string;
}

export class Event {
    public name?: string;
    public type: string = "on";
    public client: Bot;
    public emitter: string;

    constructor(client: Bot, name, options: EventOptions = {}) {
        this.name = name;
        this.client = client;
        this.type = options.once ? "once" : "on";
        this.emitter =
            (typeof options.emitter === "string"
                ? this.client[options.emitter]
                : options.emitter) || this.client;
    }

   public async run(...args) {
        throw new Error(`The run method has not been implemented in ${this.name}`);
    }
};