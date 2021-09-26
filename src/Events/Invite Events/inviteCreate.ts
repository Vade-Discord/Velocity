import { Event } from '../../Interfaces/Event';
import Collection from "@discordjs/collection";
import {Invite} from "eris";

export default class InviteCreateEvent extends Event {
    constructor(client) {
        super(client, "inviteCreate", {
        });
    }

    async run(guild, invite: Invite) {
        console.log('Invite event fired.')
            const inviteChannel = (await this.client.utils.loggingChannel(guild, 'invites'));
            if(!inviteChannel) return;
            const timed = invite?.maxAge > 0;
            if (timed) {
                console.log('timed invite')
                await this.client.redis.set(`invites.${guild.id}.${invite.code}`, JSON.stringify({ code: invite.code, inviter: invite.inviter, uses: invite.uses}), 'EX', invite.maxAge)
                const current = await this.client.redis.get(`invites.${guild.id}`);
                const currentArray = JSON.parse(current);
                let array = [];
                if(current) {
                    array = currentArray
                    array.push(invite.code);
                } else {
                    array.push(invite.code);
                }
                const arrayString = JSON.stringify(array)
                await this.client.redis.set(`invites.${guild.id}`, arrayString);
            } else {
                console.log('permanent invite')
                await this.client.redis.set(`invites.${guild.id}.${invite.code}`, JSON.stringify({ code: invite.code, inviter: invite.inviter, uses: invite.uses }))
                const current = await this.client.redis.get(`invites.${guild.id}`);
                const currentArray = JSON.parse(current);
                let array = [];
                if (current) {
                    array = currentArray
                    array.push(invite.code);
                } else {
                    array.push(invite.code);
                }
                const arrayString = JSON.stringify(array)
                await this.client.redis.set(`invites.${guild.id}`, arrayString);
            }
    }
}