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
                    options: [
                        {
                            type: 3,
                            name: 'automated-action',
                            description: "Would you like any of these to automatically happen when triggered?",
                            choices: [
                                {
                                    name: 'mute-user',
                                    value: 'mute'
                                },
                                {
                                    name: 'kick-user',
                                    value: 'kick'
                                },
                                {
                                    name: 'ban-user',
                                    value: 'ban'
                                },
                            ],
                            required: false
                        }
                    ]
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
                    options: [
                        {
                            type: 3,
                            name: 'automated-action',
                            description: "Would you like any of these to automatically happen when triggered?",
                            choices: [
                                {
                                    name: 'mute-user',
                                    value: 'mute'
                                },
                                {
                                    name: 'kick-user',
                                    value: 'kick'
                                },
                                {
                                    name: 'ban-user',
                                    value: 'ban'
                                },
                            ],
                            required: false
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'anti-scam',
                    description: 'Automaticlaly delete any phishing links.',
                    options: [
                        {
                            type: 3,
                            name: 'automated-action',
                            description: "Would you like any of these to automatically happen when triggered?",
                            choices: [
                                {
                                    name: 'mute-user',
                                    value: 'mute'
                                },
                                {
                                    name: 'kick-user',
                                    value: 'kick'
                                },
                                {
                                    name: 'ban-user',
                                    value: 'ban'
                                },
                            ],
                            required: false
                        }
                    ]
                },
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const guildData = (await this.client.utils.getGuildSchema(member.guild))!!;

        const object = guildData?.Moderation;
        const automatedActions = guildData?.Actions;

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

                    if(subOptions.has("automated-action")) {
                        const automatedAction = subOptions.get("automated-action");
                        automatedActions['linkSent'] = automatedAction;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        return interaction.createFollowup(`Succesfully **enabled** the anti links module and will **${automatedAction}** any user that links to a banned website.`);
                    } else {
                        return interaction.createFollowup('Succesfully **enabled** the anti links module.');
                    }

                }

                break;
            }
            case 'anti-scam': {


                if(guildData?.Moderation?.antiLink) {
                    object['antiScam'] = false;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    interaction.createFollowup('Succesfully **disabled** the anti-scam module.');
                } else {
                    object['antiScam'] = true;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    if(subOptions.has("automated-action")) {
                        const automatedAction = subOptions.get("automated-action");
                        automatedActions['phishing'] = automatedAction;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        return interaction.createFollowup(`Succesfully **enabled** the anti-scam module and will **${automatedAction}** any user that sends a phishing link.`);
                    } else {
                        return interaction.createFollowup('Succesfully **enabled** the anti-scam module.');
                    }

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

                    if(subOptions.has("automated-action")) {
                        const automatedAction = subOptions.get("automated-action");
                        automatedActions['advertising'] = automatedAction;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        return interaction.createFollowup(`Succesfully **enabled** the anti-invite module and will **${automatedAction}** any user that sends an invite link.`);
                    } else {
                        return interaction.createFollowup('Succesfully **enabled** the anti-invite module.');
                    }

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
