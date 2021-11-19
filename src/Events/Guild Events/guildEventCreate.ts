import { Event } from '../../Interfaces/Event';


export default class eventCreatedEvent extends Event {
    constructor(client) {
        super(client, "guildScheduledEventCreate", {

        });
    }

    async run(event) {

        console.log("Guild event created.");



    }

}