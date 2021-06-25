import { Event } from "../../interfaces/Event";
import mongo from '../../Interfaces/Database';

    export default class ReadyEvent extends Event {
        constructor(client) {
            super(client, "ready", {
                once: true,
            });
        }

        async run() {
            await mongo();
            console.log(`${this.client.user.username}${this.client.user.discriminator} has successfully logged in!`);
            this.client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com"})
        }

    }




