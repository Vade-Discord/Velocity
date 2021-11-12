import Command from "../../Interfaces/Command";
import {CommandInteraction} from "eris";
let e;

export default class PurgeCommand extends Command {
    constructor(client) {
        super(client, 'purge', {
            description: "Clear some messages from the current channel!",
            category: "Moderation",
            userPerms: ['manageMessages'],
            modCommand: true,
            options: [
                {
                    type: 10,
                    name: 'amount',
                    description: 'The amount of messages to delete.',
                    required: true,
                    min_amount: 1,
                    max_amount: 500,
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        e = this.client;


        const channel = (await this.client.getRESTChannel(interaction.channel.id))!!;
        if(channel.type !== 0) return interaction.createFollowup(`This command can only be used in text channels!`);

        const amount = options.get("amount") + 1;

        await channel.getMessages({ limit: amount }).then(function (messageArray) {
            let i;
            if(channel.guild.members.get(e.user.id).permissions.json.manageMessages) {
                const messageIdArray = [];
                for (i = 0; i < messageArray.length; i++) {
                        messageIdArray.push(messageArray[i].id)
                }
                return e.deleteMessages(channel.id, messageIdArray).catch(() => null);
            } else {
                for (i = 0; i < messageArray.length; i++) {
                      e.deleteMessage(channel.id, messageArray[i].id).catch(() => null);
                }
            }
        }).then(function (){
            return interaction.createMessage(`${amount} messages deleted.`)
        }).catch(() => null)


    }

    }