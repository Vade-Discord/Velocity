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
        const [commandName, param1, param2] = key.split(".");


        switch(commandName) {

            case "giveaway": {
                console.log('giveaway expired.');
                const giveawayData = (await giveawaySchema.findOne({ guildID: param1, messageID: param2 }));
                if(giveawayData) {
                    console.log('giveaway registered.');
                    await this.client.utils.giveawayEnded(giveawayData);
                }
                break;
            }
            case "reminder": {
                const reminderData = (await reminderSchema.findOne({ userID: param1, reminderID: param2 }));
              if(reminderData) {
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