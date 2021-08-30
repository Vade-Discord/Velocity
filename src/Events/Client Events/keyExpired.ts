import { Event } from '../../Interfaces/Event';
import giveawaySchema from '../../Schemas/Backend/Giveaways';

export default class KeyExpiredEvent extends Event {
    constructor(client) {
        super(client, "keyExpired", {

        });
    }

    async run(key) {
        const [commandName, param1, param2] = key.split(".");


        switch(commandName) {

            case "giveaway": {
                const giveawayData = (await giveawaySchema.findOne({ guildID: param1, messageID: param2 }))!!;
                await this.client.utils.giveawayEnded(giveawayData);
                break;
            }


        }
    }


}