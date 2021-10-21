import Command from "../../Interfaces/Command";

export default class RoleConfigCommand extends Command {
    constructor(client) {
        super(client, 'config', {
            description: "Explore all of the configuration commands available!",
            category: "Configuration",
            options: [
                {
                    type: 1,
                    name: 'mod-role',
                    description: 'Configure the servers moderator role(s).',
                    options: [
                        {
                            type: 3,
                            name: 'add-remove',
                            description: 'Would you like to add or remove this role as a moderator role?',
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
                        },
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role to affect.',
                            required: true,
                        }
                    ]
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const roleID = subOptions.get("role");
        const role = (await member.guild.getRESTRoles()).filter((role) => role.id === roleID)[0];
        const guildData = (await this.client.utils.getGuildSchema(interaction.guildID))!!;

        switch(interaction.data.options[0].name) {
            case "mod-role": {
                const type = subOptions.get("add-remove");
                if(type === 'add') {
                    await guildData.updateOne({
                        $push: { ModRole: roleID }
                    });

                } else {
                    if(!guildData?.ModRole.includes(roleID)) {
                        return interaction.createFollowup(`That role doesn't seem to be one of the servers Moderator roles.`);
                    }

                    await guildData.updateOne({
                        $pull: { ModRole: roleID }
                    });

                }

                interaction.createFollowup(`Successfully ${type === 'add' ? 'added' : 'removed'} **${role.name}** as a Moderator role.`);

                break;
            }


            default: {
                return;
            }
        }

    }

}
