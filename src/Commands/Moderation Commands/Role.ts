import Command from "../../Interfaces/Command";
import {Role} from "eris";

export default class RoleCommand extends Command {
    constructor(client) {
        super(client, 'role', {
            aliases: ["addrole", 'changeroles', 'removerole', 'arole', 'rrole'],
            description: "Add, remove or change a members roles.",
            category: "Moderation",
            userPerms: ['manageRoles'],
            botPerms: ['manageRoles']
        });
    }
    async run(message, args) {

        const [sub, ...ctx] = args;

        if(!args.length) return message.channel.createMessage({ content: `You need to specify who you want to change the roles of. Example: \`!role @member [Role]\``})

        switch (sub) {
            case "removeall": {
                const [id] = ctx;

                const member = await this.client.utils.getMember(message, id);

                if (!member) return;

                await Promise.all(
                    member.roles.map(async (role) => {
                        try {
                            return member.removeRole(role);
                        } catch {
                            return message.channel.createMessage({
                                    content:
                                        `Unable to remove the role <@&${role}>`,
                                messageReference: { messageID: message.id },
                                allowedMentions: { everyone: false, role: false, member: false}
                                }
                            );
                        }
                    })
                );

                return message.channel.createMessage({content:
                    `Removed all roles from the member successfully.`, messageReference: { messageID: message.id }}
                );
            }

            case "set": {
                break;
            }

            case "all": {
                const [id] = ctx;

                const role = await this.client.utils.getRoles(id, message.channel.guild);

                if (!role) return message.channel.send(`I could not find the role!`);

                const msg = await message.channel.send(`Adding roles to all members...`);

                await Promise.all(
                    message.guild.members.map(async (member) => {
                        try {
                            await member.addRole(role.id);
                        } catch {
                        }

                        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                    })
                );

                return msg.edit(`Added all roles successfully!`);
            }

            case "bots": {
                const [id] = ctx;

                const role: Role = this.client.utils.getRoles(id, message.guild);

                if (!role) return message.channel.createMessage({ content:`I could not find the role!`, messageReference: { messageID: message.id }});

                const msg = await message.channel.createMessage({content: `Adding roles to all bots..`, messageReference: { messageID: message.id }});

                await Promise.all(
                    message.guild.members
                        .filter(({user: {bot}}) => bot)
                        .map(async (member) => {
                            try {
                                await member.addRole(role.id);
                            } catch {
                            }

                            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                        })
                );

                return msg.edit({ content: `Added all roles successfully!`});
            }

            case "humans": {
                const [id] = ctx;

                const role = this.client.utils.getRoles(id, message.guild)
                if (!role) return message.channel.createMessage({ content:`I could not find the role!`, messageReference: { messageID: message.id }});

                const msg = await message.channel.createMessage({ content: `Adding roles to all humans..`, messageReference: { messageID: message.id } });

                await Promise.all(
                    message.guild.members
                        .filter(({user: {bot}}) => !bot)
                        .map(async (member) => {
                            try {
                                await member.addRole(role.id);
                            } catch {
                            }

                            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                        })
                );

                return msg.edit({content: `Added all roles successfully!` });
            }

            default: {
                const [id, ...ids] = args;

                const member = await this.client.utils.getMember(message, id);

                if(!member) return;

                try {
                    await Promise.all(
                        (
                            await Promise.all(
                                ids.map(async (i) => {
                                    const role = await this.client.utils.getRoles(i, message.channel.guild);
                                    if (role) return role;
                                    throw new TypeError(`Unable to  find the role!`);
                                })
                            )
                        ).map(async (role: Role, e) => {
                            if (!role)
                                return message.channel.createMessage({content:
                                        `Unable to find the role ${ids[e]}.`,
                                    messageReference: { messageID: message.id },
                                    allowedMentions: { everyone: false, role: false, member: false}
                        });

                            try {
                                if (member.roles.includes(role.id) || ids[e].startsWith("-"))
                                    await member.removeRole(role.id);
                                else if (
                                    !member.roles.includes(role.id) ||
                                    ids[e].startsWith("+")
                                )
                                    await member.addRole(role.id);
                            } catch(e) {
                                console.log(e)
                                return message.channel.createMessage({
                                    content: `Unable to add the role ${ids[e]}.`,
                                    messageReference: {messageID: message.id},
                                    allowedMentions: {everyone: false, role: false, member: false}
                                });
                            }
                        })
                    );
                } catch (e) {
                   return;
                }
                message.channel.createMessage({ content: `Successfully added the role(s).`, messageReference: { messageID: message.id }});
            }

        }


     }

    }
