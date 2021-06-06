import { Bot } from "../client/Client";

export interface RunFunction {
    (client: Bot, ...args: any[]): Promise<unknown> | unknown;
}

export interface Event {
    name: string;
    category: string;
    run: RunFunction;
}