import { Event } from '../../Interfaces/Event';


export default class eventDeleteEvent extends Event {
    constructor(client) {
        super(client, "guildScheduledEventDelete", {

        });
    }

    async run(event) {
        console.log("Guild event deleted.");

    }

}