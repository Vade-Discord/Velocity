import { Event } from '../../Interfaces/Event';
import giveawaySchema from '../../Schemas/Backend/Giveaways';
import reminderSchema from '../../Schemas/Backend/Reminders';

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
                if(giveawayData) {
                    await this.client.utils.giveawayEnded(giveawayData);
                }
                break;
            }
            case "reminder": {
                const reminderData = (await reminderSchema.findOne({ userID: param1 }))!!;
              if(reminderData) {
                  await this.client.utils.remind(reminderData);
              }
                break;
            }


        }
    }


}