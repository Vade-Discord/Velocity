import Command from "../../Interfaces/Command";
import giveawaySchema from "../../Schemas/Backend/Giveaways";
import ms from 'ms';
import {NewsChannel, TextChannel} from "eris";

export default class GiveawayCommand extends Command {
    constructor(client) {
        super(client, 'giveaway', {
            aliases: [""],
            description: "Contains all of the different giveaway options.",
            category: "Configuration",
            userPerms: ['manageMessages'],
            options: [
                {
                    type: 1,
                    name: 'start',
                    description: 'Begin a giveaway in the current server.',
                    options: [
                        {
                            type: 7,
                            name: 'channel',
                            description: `The channel the giveaway should be hosted in.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'time',
                            description: `The length of time for the giveaway.`,
                            required: true,
                        },
                        {
                            type: 10,
                            name: 'winners',
                            description: `The amount of winners.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'prize',
                            description: `The prize for the giveaway.`,
                            required: true,
                        },
                        {
                            type: 8,
                            name: 'role-required',
                            description: `The role required to enter (If any).`,
                            required: false,
                        },
                    ]
                },
                {
                    type: 1,
                    name: 'end',
                    description: `End a giveaway.`,
                    options: [
                        {
                            type: 3,
                            name: 'message-id',
                            description: `The message ID of the giveaway.`,
                            required: true,
                        },
                    ]
                },
                {
                    type: 1,
                    name: 'edit',
                    description: `Edit a giveaway and change the prize, time or winner count.`,
                    options: [
                        {
                            type: 3,
                            name: 'message-id',
                            description: `The message ID of the giveaway.`,
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'prize',
                            description: `The new prize for the giveaway.`,
                            required: false,
                        },
                        {
                            type: 3,
                            name: 'time',
                            description: `The new length of time for the giveaway.`,
                            required: false,
                        },
                        {
                            type: 10,
                            name: 'winners',
                            description: `The new amount of winners.`,
                            required: false,
                        },
                        {
                            type: 8,
                            name: 'role-required',
                            description: `The role required to enter (If any).`,
                            required: false,
                        },
                    ]
                },
            ],
        });
    }
    async run(interaction, member, options, subOptions) {

        this.client.redis.expire((message) => {
            if(message.startsWith("giveaways")) {
                console.log(message)
            }
        })

        if(interaction.data.custom_id) {

            const giveawayData = await giveawaySchema.findOne({ guild: interaction.guildID, messageID: interaction.message.id });
            if(giveawayData) {
                if(giveawayData?.roleRequired) {
                    if(!member.roles.includes(giveawayData?.roleRequired)) {
                        member.user.getDMChannel().then((c) => {
                            c.createMessage(`You are unable to enter this giveaway due to you missing the required role.`).catch((e) => {
                                interaction.createFollowup({ content: `You are unable to enter this giveaway due to you missing the required role.`, flags: 64 });
                            });
                        });
                        return;
                    }
                }
            }

            // Button pressed
                member.user.getDMChannel().then((c) => {
                    c.createMessage(`You have successfully entered the giveaway!`).catch((e) => {
                        interaction.createFollowup({ content: `You have successfully entered the giveaway!`, flags: 64 });
                    });
                });

            return;
        }

        const located = await giveawaySchema.find({ guild: interaction.guildID });
        if(located?.length && located?.length > 5 && !(await this.client.utils.checkPremium(interaction.guildID))) {
            return interaction.createFollowup(`Unless the guild owner has vade premium, you can only have 5 giveaways at once.`);
        }

        switch (interaction.data.options[0].name) {

            case "start": {

                const channelID = subOptions.get('channel');
                const channel = (await this.client.getRESTChannel(channelID));
                if(!channel) {
                    return interaction.createFollowup(`Something seems to have gone wrong... please try again.`);
                }

                const prize = subOptions.get('prize');
                const time = subOptions.get('time');
                console.log(time)
                const actualTime = ms(time);
                console.log(new Date().getTime() + actualTime)
                if(!actualTime) {
                    return interaction.createFollowup(`You seem to have provided an invalid length of time.`);
                }

                const roleRequirement = subOptions.has("role-required") ? member.guild.roles.get(subOptions.get("role-required")).mention : 'No Role Required.';

                let count = [];
                if(subOptions.has("role-required")) {
                    count.push("1");
                }
                if(subOptions.has("invites")) {
                    count.push(2);
                }
                if(subOptions.has("voice-time")) {
                    count.push(3);
                }
                if(count.length > 1 && !(await this.client.utils.checkPremium(interaction.guildID))) {
                    return interaction.createFollowup(`Only vade premium members can have multiple requirements set.`);
                }
                const giveawayEmbed = new this.client.embed()
                    .setTitle('🎉 Giveaway! 🎉')
                    .setDescription(`Click the button to enter!\nEnds: <t:${actualTime + Date.now()}:R>\nGiveaway Host: ${member.mention}`)
                    .addField(`Prize`, `${prize}`)
                    .addField(`Requirements`, `Role Requirement: ${roleRequirement} \n\n`)
                    .setTimestamp()
                    .setFooter(`Vade Giveaways @ https://vade-bot.com`)
                    .setThumbnail(this.client.user.avatarURL)

                if(channel instanceof TextChannel || channel instanceof NewsChannel) {

                    // @ts-ignore
                    channel.createMessage({ embeds: [giveawayEmbed], components: [{
                        type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: `Enter!`,
                                    custom_id: `giveaway#enter`,
                                    emoji: { id: this.client.constants.emojis.giveaway.id, name: this.client.constants.emojis.giveaway.name, animated: false },
                                }
                            ]
                    }]
                    }).then(async (m) => {
                        console.log(subOptions.get("role-required"))
                        const role = subOptions.get("role-required") ? subOptions.get("role-required") : null;
                        const newSchema = new giveawaySchema({
                            guild: interaction.guildID,
                            messageID: m.id,
                            roleRequired: role,
                        });
                        await newSchema.save()
                        await this.client.redis.set(`giveaways.${interaction.guildID}.${m.id}`, m.id, 'EX', actualTime * 1000)
                    });
                    //
                } else {
                    return interaction.createFollowup(`The channel you provided needs to be either a text channel or a news channel.`);
                }





                break;
            }

            case "edit": {
                const messageID = subOptions.get('message-id');
                break;
            }
        }



    }

}
