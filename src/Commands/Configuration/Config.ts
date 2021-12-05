import Command from "../../Interfaces/Command";

export default class RoleConfigCommand extends Command {
    constructor(client) {
        super(client, 'config', {
            description: "Explore all of the configuration commands available!",
            category: "Configuration",
            userPerms: ["manageGuild"],
            botPerms: ["manageMessages"],
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
                },
                {
                    type: 1,
                    name: 'welcome-message',
                    description: 'Customise your servers welcome message with built in formats.',
                    options: [
                        {
                            type: 3,
                            name: 'message',
                            description: 'The message you would like to set it as.',
                            autocomplete: true,
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'nickname-format',
                    description: 'Customise how your members nicknames must be formatted.',
                    options: [
                        {
                            type: 3,
                            name: 'format',
                            description: 'The nicknames they should have.',
                            autocomplete: true,
                            required: true,
                        }
                    ]
                },

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

            case "welcome-message": {

                const msg = subOptions.get("message");
                console.log(msg)
                await guildData.updateOne({
                    welcomeMessage: msg,
                });
                interaction.createFollowup(`Successfully set your welcome message.`);


                break;
            }

            case "nickname-format": {


                await guildData.updateOne({
                    nicknameFormat: subOptions.get("format"),
                });


                interaction.createFollowup(`Successfully set your new nickname format to: \`${subOptions.get("format")}\``);

                break;
            }


            default: {
                return;
            }
        }

    }

    async autocomplete(interaction, options, member) {

        const [focused] = options.filter((option) => option.options.filter((op) => op.focused === true))
        let result = []

        if(focused) {

            if(!focused.options[0].value?.length) {
                return;
            }

        switch (interaction.data.options[0].name) {

            case "welcome-message": {

                    const message = await this.client.utils.Interpolate(focused.options[0].value, {
                        username: `${member.username}`,
                        tag: `${member.username}#${member.discriminator}`,
                        id: `${member.id}`,
                        guildName: `${member.guild.name}`,
                        guildID: `${member.guild.id}`,
                        mention: `${member.mention}`
                    }).catch((e) => {
                        if(e) {
                            return;
                        }
                    });

                    if(!message) {
                        return;
                    }

                    result.push({
                        name: message,
                        value: focused.options[0].value
                    })

                if(!result[0]) return
                return interaction.result(result);

                }

            case "nickname-format": {

                const message = await this.client.utils.Interpolate(focused.options[0].value, {
                    username: `${member.username}`,
                    tag: `${member.username}#${member.discriminator}`,
                    id: `${member.id}`,
                    guildName: `${member.guild.name}`,
                    guildID: `${member.guild.id}`,
                    highestRole: `${this.client.utils.getHighestRole(member, member.guild)?.name ?? 'No Role'}`,
                    wallet: `$${(await this.client.utils.getProfileSchema(member.id))?.Wallet ?? 0}`,
                    bank: `$${(await this.client.utils.getProfileSchema(member.id))?.Bank ?? 0}`,
                }).catch((e) => {
                    if(e) {
                        return;
                    }
                });

                if(!message) {
                    return;
                }

                result.push({
                    name: message,
                    value: focused.options[0].value
                })

                if(!result[0]) return
                return interaction.result(result);

            }

            }

        }



    }

}
