import { Event } from '../../Interfaces/Event';
import Collection from "@discordjs/collection";

export default class InviteCreateEvent extends Event {
    constructor(client) {
        super(client, "inviteCreate", {
        });
    }

    async run(guild, invite) {

        const gi: any = this.client.invites.get(guild.id);
            gi.set(invite.code, invite);
            this.client.invites.set(guild.id, gi);
    }

}