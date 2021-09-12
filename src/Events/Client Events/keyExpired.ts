import { Event } from '../../Interfaces/Event';
import giveawaySchema from '../../Schemas/Backend/Giveaways';
import reminderSchema from '../../Schemas/Backend/Reminders';
import muteSchema from '../../Schemas/Backend/Muted';

export default class KeyExpiredEvent extends Event {
    constructor(client) {
        super(client, "keyExpired", {

        });
    }

    async run(key) {
        console.log("key expiration fired")
        const [commandName, param1, param2] = key.split(".");


        switch(commandName) {

            case "giveaway": {
                const giveawayData = (await giveawaySchema.findOne({ guildID: param1, messageID: param2 }));
                if(giveawayData) {
                    await this.client.utils.giveawayEnded(giveawayData);
                }
                break;
            }
            case "reminder": {
                console.log(`Reminder is being fired`)
                const reminderData = (await reminderSchema.findOne({ userID: param1, reminderID: param2 }));
              if(reminderData) {
                  console.log(`Found data`)
                  await this.client.utils.remind(reminderData);
              }
                break;
            }

            case "mute": {
                const muteData = (await muteSchema.findOne({ userID: param1, guildID: param2 }));
                if(muteData) {
                    await this.client.utils.muteEnded(muteData);
                }
            }


        }
    }


}