import { Event } from '../../Interfaces/Event';

export default class EventName extends Event {
    constructor(client) {
        super(client, "warn", {

        });
    }

    async run(warn) {
        this.client.logger.warn(warn);
    }

}