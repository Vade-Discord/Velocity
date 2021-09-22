import { Event } from '../../Interfaces/Event';

export default class FactionCreatedEvent extends Event {
    constructor(client) {
        super(client, "factionCreated", {

        });
    }

    async run(faction, member) {

        console.log(`${faction.name} was created by ${member.username}#${member.discriminator}`);

    }

}