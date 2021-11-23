import { Event } from '../../Interfaces/Event';


export default class eventName extends Event {
    constructor(client) {
        super(client, "rawWS", {

        });
    }

    async run(packet) {
        this.client.manager.updateVoiceState(packet);
    }

}