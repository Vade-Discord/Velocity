import Command from "../../Interfaces/Command";

export default class AutomodCommand extends Command {
    constructor(client) {
        super(client, 'automod', {
            description: "Toggle any of the auto moderation modules.",
            category: "Configuration",
            guildOnly: true,
            userPerms: ['manageGuild', 'kickMembers'],
            botPerms: ['manageMessages', 'kickMembers', 'banMembers'],
            options: [
                {
                    type: 1,
                    name: 'anti-link',
                    description: 'Auto delete any links, including discord invites.',
                },
                {
                    type: 1,
                    name: 'profanity-filter',
                    description: 'Auto delete any curse, racist or generally rude words.',
                },
                {
                    type: 1,
                    name: 'anti-invite',
                    description: 'Auto delete any discord invites.',
                }
            ]
        });
    }
    async run(interaction, member) {

        const guildData = (await this.client.utils.getGuildSchema(member.guild))!!;

        const object = guildData?.Moderation;

        switch(interaction.data.options[0].name) {

            case 'anti-link': {


                if(guildData?.Moderation?.antiLink) {
                    object['antiLink'] = false;
                    await guildData.updateOne({
                    Moderation: object
                    });

                    interaction.createFollowup('Succesfully **disabled** the anti links module.');
                } else {
                    object['antiLink'] = true;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    interaction.createFollowup('Succesfully **enabled** the anti links module.');
                }


                break;
            }
            case 'anti-invite': {


                if(guildData?.Moderation?.antiInvite) {
                    object['antiInvite'] = false;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    interaction.createFollowup('Succesfully **disabled** the anti invites module.');
                } else {
                    object['antiInvite'] = true;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    interaction.createFollowup('Succesfully **enabled** the anti invites module.');
                }


                break;
            }

            case 'profanity-filter':  {
                if(guildData?.Moderation?.antiProfanity) {
                    object['antiProfanity'] = false;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    interaction.createFollowup('Succesfully **disabled** the profanity filter module.');
                } else {
                    object['antiProfanity'] = true;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    interaction.createFollowup('Succesfully **enabled** the profanity filter module.');
                }


                break;
            }

            default: {
                return;
            }
        }




    }

}
