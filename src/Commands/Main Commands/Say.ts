import Command from "../../Interfaces/Command";
import Eris from "eris";

export default class SayCommand extends Command {
    constructor(client) {
        super(client, 'say', {
            aliases: [""],
            description: "Have the Bot say whatever you like!",
            category: "Development",
            devOnly: true,
            options: [
                {
                    type: 3,
                    name: 'text',
                    description: `The text you would like it to send.`,
                    required: true,
                },
                {
                    type: 7,
                    name: 'channel',
                    description: `The channel to send the text to. (Defaults to current)`,
                    required: false,
                },
               ],
        });
    }
    async run(interaction, member) {

        if(!this.client.owners.includes(member.id)) {
            return interaction.createFollowup(`Sorry! Only the bot developers can use this command!`);
        }

        const text = interaction.data.options?.filter(m => m.name === "text")[0].value;
        if(interaction.data.options?.filter(m => m.name === "channel")[0]?.value) {
            const channelID = interaction.data.options?.filter(m => m.name === "channel")[0]?.value;
            const channel = this.client.getChannel(channelID);
            if(channel) {
                if(channel instanceof Eris.TextChannel) {
                    channel.createMessage(text);
                    return interaction.createFollowup(`Successfully sent!`);
                } else {
                    return interaction.createFollowup(`Looks like either the channel was not located or it was not a text channel.`);
                }

            }
        } else {
            return interaction.createFollowup(text);
        }


    }

}
