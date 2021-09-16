import Command from "../../Interfaces/Command";

export default class RoleConfigCommand extends Command {
    constructor(client) {
        super(client, 'role-config', {
            description: "Configure the guilds mod-role, giveaway host role and more!",
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
    async run(interaction, member) {

        switch(interaction.data.options[0].name) {
            case "mod-role": {


                break;
            }


            default: {
                return;
            }
        }

    }

}
