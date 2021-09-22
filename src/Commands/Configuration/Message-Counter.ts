import Command from "../../Interfaces/Command";
import messageSchema from "../../Schemas/Backend/Messages";

export default class CounterCommand extends Command {
    constructor(client) {
        super(client, 'message-counter', {
            description: "All commands related to the message counter.",
            category: "Configuration",
            options: [
                {
                    type: 1,
                    name: 'check',
                    description: 'Check how many messages a certain user has sent.',
                    options: [
                        {
                            type: 6,
                            name: 'user',
                            description: 'The user you would like to check the messages for.',
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'configure',
                    description: 'Configure the message counter for the current server.',
                    options: [
                        {
                            type: 5,
                            name: 'enable',
                            description: 'Would you like the counter to be enabled?',
                            required: true,
                        }
                    ],
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const guildData = (await this.client.utils.getGuildSchema(member.guild))!!;

        switch (interaction.data.options[0].name) {
            case "configure": {
                if(!member.permissions.has("manageGuild")) {
                    return interaction.createFollowup('Sorry! Only members with the **manageGuild** permission can run this sub-command.');
                }
                if(subOptions.get("enable") === true) {
                    if(guildData?.MessageCounter) {
                        return interaction.createFollowup('The message counter is already enabled for this guild.');
                    }
                    await guildData.updateOne({
                        MessageCounter: true,
                    });
                    return interaction.createFollowup('Successfully **enabled** the message counter for this guild.');
                } else {
                    if(!guildData?.MessageCounter) {
                        return interaction.createFollowup('The message counter is already disabled for this guild.');
                    }
                    await guildData.updateOne({
                        MessageCounter: false,
                    });
                    return interaction.createFollowup('Successfully **disabled** the message counter for this guild.');
                }
            }
            case "check": {
                const userID = subOptions.get("user");
                const userMessageSchema = (await messageSchema.findOne({ userID: userID, guildID: interaction.guildID }));
                const nf = new Intl.NumberFormat();
                if(!userMessageSchema) {
                    return interaction.createFollowup('That user has no recorded messages sent.');
                } else {
                    return interaction.createFollowup(`That user has **${nf.format(userMessageSchema.amount)}** messages sent in this guild.`);
                }
            }
        }



    }

}
