import Command from "../../Interfaces/Command";
import GuildAutoRoles from "../../Schemas/Main-Guilds/GuildAutoRoles";

export default class AutoroleCommand extends Command {
    constructor(client) {
        super(client, 'autorole', {
            description: "Configure what roles are added to a member when they join the server.",
            category: "Configuration",
            userPerms: ['manageGuild'],
            botPerms: ['manageRoles'],
            options: [
                {
                    type: 1,
                    name: 'add',
                    description: 'Add a role to the auto role module.',
                    options: [
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role you would like to add.',
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'enable',
                    description: 'Enable/Disable the automatic roles module.',
                    options: [
                        {
                            type: 5,
                            name: 'choice',
                            description: 'Would you like to enable or disable this module?',
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'remove',
                    description: 'Remove a role from the auto role module.',
                    options: [
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role you would like to remove.',
                            required: true
                        }
                    ]
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {


        const AutoRoleSchema = (await GuildAutoRoles.findOne({ guildID: interaction.guildID }));
        switch(interaction.data.options[0].name) {

            case "add": {
                const roleID = subOptions.get("role");
                if(AutoRoleSchema) {
                    if(AutoRoleSchema?.roles.includes(roleID)) {
                        return interaction.createFollowup('That role is already configured as an automatic role.');
                    }
                    await AutoRoleSchema.updateOne({
                        $push: { roles: roleID }
                    });
                    interaction.createFollowup(`Successfully added that role to the auto role module!`);
                } else {
                    const newSchema = new GuildAutoRoles({
                        guildID: interaction.guildID,
                        roles: roleID,
                        enabled: true,
                    });

                    await newSchema.save();
                    interaction.createFollowup('Successfully added that role to the auto role module!');
                }
                break;
            }
            case "remove": {
                const roleID = subOptions.get("role");
                if(!AutoRoleSchema) {
                    return interaction.createFollowup('You do not have any automatic roles setup in this server!');
                }
                if(!AutoRoleSchema?.roles.includes(roleID)) {
                    return interaction.createFollowup('That role is not configured as an automatic role.');
                }
                await AutoRoleSchema.updateOne({
                    $pull: { roles: roleID }
                });
                interaction.createFollowup('Successfully removed that role from the automatic roles module.');
                break;
            }
            case "enable": {
                const choice = subOptions.get("choice");
                if(!AutoRoleSchema) {
                    return interaction.createFollowup('You do not currently have the automatic roles module configured.');
                }

                switch (choice) {

                    case true: {
                        if(AutoRoleSchema.enabled) {
                            return interaction.createFollowup('The module is already enabled.');
                        }
                        await AutoRoleSchema.updateOne({
                            enabled: true
                        });
                        interaction.createFollowup('Successfully enabled the module!');
                        break;
                    }

                    case false: {
                        if(!AutoRoleSchema.enabled) {
                            return interaction.createFollowup('The module is already enabled.');
                        }
                        await AutoRoleSchema.updateOne({
                            enabled: false
                        });
                        interaction.createFollowup('Successfully disabled the module!');
                        break;
                    }

                }

            }

        }



    }

}
