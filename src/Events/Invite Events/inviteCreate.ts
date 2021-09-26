import { Event } from '../../Interfaces/Event';
import Collection from "@discordjs/collection";
import {Invite} from "eris";

export default class InviteCreateEvent extends Event {
    constructor(client) {
        super(client, "inviteCreate", {
        });
    }

    async run(guild, invite: Invite) {
            const inviteChannel = (await this.client.utils.loggingChannel(guild, 'invites'));
            if(!inviteChannel) return;
            console.log('Invite event fired.')
            const timed = invite?.temporary;
            if(timed) {
                await this.client.redis.set(`invites.${guild.id}.${invite.code}`, `${invite.inviter.id}#${invite.uses}`, 'EX', invite.maxAge)
                const current = await this.client.redis.get(`invites.${guild.id}`);
                let array = [];
                if(current) {
                    array = current;
                } else {
                    current.push(invite.code);
                }
                await this.client.redis.set(`invites.${guild.id}`, current);
            } else {
                await this.client.redis.set(`invites.${guild.id}.${invite.code}`, `${invite.inviter.id}#${invite.uses}`);
                const current = await this.client.redis.get(`invites.${guild.id}`);
                let array = [];
                if(current) {
                    array = current;
                } else {
                    current.push(invite.code);
                }
                await this.client.redis.set(`invites.${guild.id}`, current);
            }
    }
}