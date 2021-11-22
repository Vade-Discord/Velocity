import Command from "../../Interfaces/Command";
import {Member} from "eris";

export default class RoleCommand extends Command {
    constructor(client) {
        super(client, 'role', {
            description: "All role related commands.",
            category: "Moderation",
            userPerms: ['manageRoles'],
            botPerms: ['manageRoles'],
            guildOnly: true,
            options: [
                {
                    type: 1,
                    name: 'member',
                    description: 'Add/Remove a role from a member.',
                    options: [
                        {
                            type: 6,
                            name: 'member',
                            description: 'The member to add/remove the role from.',
                            required: true,
                        },
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role to add/remove.',
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'bots',
                    description: 'Add/Remove a role from all bots.',
                    options: [
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role to add/remove.',
                            required: true,
                        },
                        {
                            type: 3,
                            name: `add-remove`,
                            description: 'Would you like to add or remove the selected role?',
                            choices: [
                                {
                                    name: 'add',
                                    value: 'add'
                                },
                                {
                                    name: 'remove',
                                    value: 'remove'
                                }
                            ],
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'humans',
                    description: 'Add/Remove a role from all humans.',
                    options: [
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role to add/remove.',
                            required: true,
                        },
                        {
                            type: 3,
                            name: `add-remove`,
                            description: 'Would you like to add or remove the selected role?',
                            choices: [
                                {
                                    name: 'add',
                                    value: 'add'
                                },
                                {
                                    name: 'remove',
                                    value: 'remove'
                                }
                            ],
                            required: true,
                        }
                    ]
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const subCommand = interaction.data.options;
        const roleID = subOptions.get("role");
        const role = member.guild.roles.get(roleID);

        switch(subCommand[0].name) {

            case "member": {

                const memberID = subOptions.get("member");
                const member1 = (await member.guild.getMember(memberID))!!;
                if(!member1) {
                    return interaction.createFollowup(`Unable to locate that member. Please try again later.`);
                }
                if(member1.roles.includes(roleID)) {
                    await member1.removeRole(roleID, `${member.username}#${member.discriminator} used the role command.`).catch(() => {
                        return interaction.createFollowup(`Looks like an error occured whilst removing that role.. please try asgain later.`);
                    });
                     interaction.createFollowup(`Successfully **removed** that role from **${member1.username}#${member1.discriminator}**.`);
                } else {
                    member1.addRole(roleID, `${member.username}#${member.discriminator} used the role command.`).catch(() => {
                        return interaction.createFollowup(`Looks like an error occured whilst adding that role.. please try asgain later.`);
                    });
                    interaction.createFollowup(`Successfully **added** that role to **${member1.username}#${member1.discriminator}**.`);
                }

                break;
            }
                case "humans": {
                    const guildMembers = (await member.guild.getRESTMembers({
                        limit: 1000
                    }));


                    const humans = guildMembers.filter(m => !m.bot);
                    const add = subOptions.get("add-remove") === 'add';

                    if(humans.length) {
                        try {
                            interaction.createFollowup({ content: `Adding the roles... this could take a while.`, flags: 64 });
                         await humans.forEach(async (human) => {
                                if (add) {
                                    human.addRole(roleID, `${member.username}#${member.discriminator} used the role command.`);
                                } else {
                                    human.removeRole(roleID, `${member.username}#${member.discriminator} used the role command.`);
                                }
                            });
                            interaction.createFollowup(`Successfully ${add ? 'added' : 'removed'} the role ${add ? 'to': 'from'} all humans.`);
                        } catch (e) {
                            return interaction.createFollowup(`Looks like an error occured..`);
                        }
                    } else {
                        return interaction.createFollowup(`Looks like an error has occured... unable to locate any humans.`);
                    }


                    break;
                }

            case "bots": {
                const guildMembers = (await member.guild.getRESTMembers({
                    limit: 1000
                }));


                const bots = guildMembers.filter(m => m.bot);
                const add = subOptions.get("add-remove") === 'add';

                if(bots.length) {
                    try {
                        interaction.createFollowup({ content: `Adding the roles... this could take a while.`, flags: 64 });
                       await bots.forEach(async (human) => {
                            if (add) {
                                human.addRole(roleID, `${member.username}#${member.discriminator} used the role command.`);
                            } else {
                                human.removeRole(roleID, `${member.username}#${member.discriminator} used the role command.`);
                            }
                        });
                        interaction.createFollowup(`Successfully ${add ? 'added' : 'removed'} the role ${add ? 'to': 'from'} all bots.`);
                    } catch (e) {
                        return interaction.createFollowup(`Looks like an error occured..`);
                    }
                } else {
                    return interaction.createFollowup(`Unable to locate any bots.`);
                }

                break;
            }



            default:
                return;
        }

    }

}
