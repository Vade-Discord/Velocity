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
                                    name: 'remove-action',
                                    value: 'none'
                                },
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
                                    name: 'remove-action',
                                    value: 'none'
                                },
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
                                    name: 'remove-action',
                                    value: 'none'
                                },
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
                    name: 'mass-mention',
                    description: 'Automaticlaly delete any message containing multiple member-mentions.',
                    options: [
                        {
                            type: 10,
                            name: 'mention-amount',
                            description: 'How many mentions should trigger this?',
                            required: true
                        },
                        {
                            type: 3,
                            name: 'automated-action',
                            description: "Would you like any of these to automatically happen when triggered?",
                            choices: [
                                {
                                    name: 'remove-action',
                                    value: 'none'
                                },
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
                            required: true
                        },
                    ],
                },
                {
                    type: 1,
                    name: 'anti-emote-spam',
                    description: 'Automaticlaly delete any message containing multiple emotes.',
                    options: [
                                {
                                    type: 10,
                                    name: 'emote-amount',
                                    description: 'How many emotes should trigger this?',
                                    required: true
                                },
                                {
                                    type: 3,
                                    name: 'automated-action',
                                    description: "Would you like any of these to automatically happen when triggered?",
                                    choices: [
                                        {
                                            name: 'remove-action',
                                            value: 'none'
                                        },
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
                                    required: true
                                },       
                    ]
                },
            ]
        })
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
                        automatedActions['linkSent'] = automatedAction !== 'none' ? automatedAction : null;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        automatedAction !== 'none' ? interaction.createFollowup(`Succesfully **enabled** the anti links module and will **${automatedAction}** any user that links to a banned website.`) : interaction.createFollowup('Succesfully **enabled** the anti links module.');
                        return
                    } else {
                        return interaction.createFollowup('Succesfully **enabled** the anti links module.');
                    }

                }

                break;
            }
            case 'mass-mention': {


                if(guildData?.Moderation?.massMention) {
                    object['massMention'] = false;
                    await guildData.updateOne({
                    Moderation: object
                    });
                    interaction.createFollowup('Succesfully **disabled** the mass-mention module.');
                } else {
                    object['massMention'] = true;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    if(subOptions.has("automated-action")) {
                        const automatedAction = subOptions.get("automated-action");
                        automatedActions['massMention'] = automatedAction !== 'none' ? automatedAction : null;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        const amount = subOptions.get("mention-amount"); 
                        object["mentionAmount"] = amount ? amount : object["mentionAmount"];
                        
                        await guildData.updateOne({
                            Moderation: object
                        })
                        
                        automatedAction !== 'none' ? interaction.createFollowup(`Succesfully **enabled** the mass-mention module and will **${automatedAction}** any member thats mentions multiple members.`) : interaction.createFollowup('Succesfully **enabled** the anti links module.');
                        return
                    } else {
                        return interaction.createFollowup('Succesfully **enabled** the mass-mention module.');
                    }

                }

                break;
            }
            case 'anti-emote-spam': {


                if(guildData?.Moderation?.emoteSpam) {
                    object['emoteSpam'] = false;
                    await guildData.updateOne({
                    Moderation: object
                    });
                    interaction.createFollowup('Succesfully **disabled** the anti-emote-spam module.');
                } else {
                    object['emoteSpam'] = true;
                    await guildData.updateOne({
                        Moderation: object
                    });

                    if(subOptions.has("automated-action")) {
                        const automatedAction = subOptions.get("automated-action");
                        automatedActions['emoteSpam'] = automatedAction !== 'none' ? automatedAction : null;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        const amount = subOptions.get("emote-amount"); 
                        object["emoteAmount"] = amount ? amount : object["emoteAmount"];
                        
                        await guildData.updateOne({
                            Moderation: object
                        })
                        
                        automatedAction !== 'none' ? interaction.createFollowup(`Succesfully **enabled** the anti-emote-spam module and will **${automatedAction}** any member that has multiple emotes in a message.`) : interaction.createFollowup('Succesfully **enabled** the anti links module.');
                        return
                    } else {
                        return interaction.createFollowup('Succesfully **enabled** the anti-emote-spam module.');
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
                        automatedActions['phishing'] = automatedAction !== 'none' ? automatedAction : null;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        automatedAction !== 'none' ? interaction.createFollowup(`Succesfully **enabled** the anti-scam module and will **${automatedAction}** any user that sends a phishing link.`) : interaction.createFollowup('Succesfully **enabled** the anti-scam module.');
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
                        automatedActions['advertising'] = automatedAction !== 'none' ? automatedAction : null;
                        await guildData.updateOne({
                            Actions: automatedActions
                        });
                        automatedAction !== 'none' ? interaction.createFollowup(`Succesfully **enabled** the anti-invite module and will **${automatedAction}** any user that sends an invite link.`) : interaction.createFollowup('Succesfully **enabled** the anti-invite module.');
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
