import Command from "../../Interfaces/Command";
import {Constants} from "eris";
import moment from 'moment';

export default class TwitchSetupCommand extends Command {
    constructor(client) {
        super(client, 'live-notifications', {
            aliases: [""],
            description: "Setup going live notifications for twitch",
            category: "Configuration",
            userPerms: ['manageGuild', 'administrator'],
            guildOnly: true,
            options: [
                {
                    type: 1,
                    name: 'twitch',
                    description: 'Setup going live notifications for twitch',
                    options: [
                        {
                            type: 3,
                            name: 'twitch-account',
                            description: `The twitch account you would like to be notified for.`,
                            required: true,
                        },
                         {
                             type: 7,
                             name: 'notification-channel',
                             description: 'The channel you want the notification to send to.',
                             required: true
                         }
                    ]
                }
                
            ],
        });
    }
    async run(interaction, member, options, subOptions) {

        const guildData = (await this.client.utils.getGuildSchema(interaction.guildID))!!
        const object = guildData?.Notifications
        switch(interaction.data.options[0].name) {
            case 'twitch' : {
                if(guildData?.Notifications.twitch) {
                    object['twitch'] = false
                    await guildData.updateOne({
                        Notifications: object
                    })
                    interaction.createFollowup('Successfully **disabled** twitch notifications module!')
                } else {
                    object['twitch'] = true
                    await guildData.updateOne({
                        Notifications: object
                    })

                    const textChannel = subOptions.get('notification-channel')
                    const twitchAccount = subOptions.get('twitch-account')
                    object["twitchChannelName"] = twitchAccount ? twitchAccount : object["twitchChannelName"]

                    await guildData.updateOne({
                        Notifications: object
                    })
                    object["notificationChannel"] = textChannel ? textChannel : object["notificationChannel"]

                    await guildData.updateOne({
                        Notifications: object
                    })
                    return interaction.createFollowup('Successfully **enabled** twitch notifications module!')
                }
                break;
            }
            default: {
                return
            }
        }

    }

}
