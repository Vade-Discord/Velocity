import Command from "../../Interfaces/Command";
import giveawaySchema from "../../Schemas/Backend/Giveaways";
import voiceSchema from "../../Schemas/User Schemas/Voice";
import ms from 'ms';
import humanize from 'humanize-duration';
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
                            description: `The length of time for the giveaway. (Example: 1d)`,
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
                        {
                            type: 3,
                            name: 'voice-time',
                            description: `The amount of time they should have spent in VC.`,
                            required: false,
                        },
                        {
                            type: 3,
                            name: 'guild-time',
                            description: `The amount of time they should have been in the guild for.`,
                            required: false,
                        },
                    ]
                },
                {
                    type: 1,
                    name: 'delete',
                    description: `Delete a giveaway.`,
                    options: [
                        {
                            type: 7,
                            name: 'channel',
                            description: `The channel that the giveaway is hosted in.`,
                            required: true,
                        },
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

        // this.client.redis.expire((message) => {
        //     if(message.startsWith("giveaways")) {
        //         console.log(message)
        //     }
        // })

        if(interaction.data.custom_id) {

            const giveawayData = await giveawaySchema.findOne({ guildID: interaction.guildID, messageID: interaction.message.id });
            if(!giveawayData) {
                return interaction.createFollowup({ content: `There seems to be an issue with this giveaway's data. Please notify the giveaway host.`, flags: 64 });
            }
            if(giveawayData?.entrants?.length && giveawayData.entrants.includes(member.id)) {
                return interaction.createFollowup({ content: `You have already entered this giveaway!`, flags: 64 });
            }
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
                if(giveawayData?.voiceRequired) {
                    const userTime = await voiceSchema.findOne({ guild: interaction.guildID, user: member.id });
                    if(!userTime || userTime.total < giveawayData.voiceRequired) {
                        member.user.getDMChannel().then((c) => {
                            c.createMessage(`You are unable to enter this giveaway due to you not spending enough time in their Voice Channels.`).catch((e) => {
                                interaction.createFollowup({ content: `You are unable to enter this giveaway due to you not spending enough time in their Voice Channels.`, flags: 64 });
                            });
                        });
                        return;
                    }
                }
                if(giveawayData?.guildTime) {
                    const memberJoinDate = interaction.member.joinedAt;
                    if(memberJoinDate > Date.now() - giveawayData?.guildTime) {
                        member.user.getDMChannel().then((c) => {
                            c.createMessage(`You are unable to enter this giveaway due to you not spending enough time in the server.`).catch((e) => {
                                interaction.createFollowup({ content: `You are unable to enter this giveaway due to you not spending enough time in the server.`, flags: 64 });
                            });
                        });
                        return;
                    }
                }
            // Button pressed
                member.user.getDMChannel().then((c) => {
                    c.createMessage(`You have successfully entered the giveaway!`).catch((e) => {
                        interaction.createFollowup({ content: `You have successfully entered the giveaway!`, flags: 64 });
                    });
                });

           await giveawayData.updateOne({
               $push: { entrants: member.id }
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
                const actualTime = ms(time);
                if(!actualTime || !time.endsWith("s" || "d" || "w" || "m" || "y" || "h")) {
                    return interaction.createFollowup(`You seem to have provided an invalid length of time.`);
                }


                const roleRequirement = subOptions.has("role-required") ? member.guild.roles.get(subOptions.get("role-required")).mention : 'No Role Required.';
                const voiceRequirement = subOptions.has("voice-time") ? humanize(ms(subOptions.get("voice-time"))) : 'No VC time required.';
                const guildRequirement = subOptions.has("guild-time") ? humanize(ms(subOptions.get("guild-time"))) : 'No server time required.';
                let count = [];
                if(subOptions.has("role-required")) {
                    count.push(1);
                }
                if(subOptions.has("invites")) {
                    count.push(2);
                }
                if(subOptions.has("voice-time")) {
                    count.push(3);
                }
                if(subOptions.has("guild-time")) {
                    count.push(4);
                }
                if(count.length > 1 && !(await this.client.utils.checkPremium(interaction.guildID))) {
                    return interaction.createFollowup(`Only vade premium members can have multiple requirements set.`);
                }

                if(subOptions.has("voice-time") && ms(subOptions.get("voice-time")) > ms("1d") && !(await this.client.utils.checkPremium(interaction.guildID))) {
                    return interaction.createFollowup(`The Voice Requirement can only be over 24 hours if the guild owner has vade premium.`);
                }
                if(subOptions.has("voice-time") && ms(subOptions.get("voice-time")) > ms("30d")) {
                    return interaction.createFollowup(`Sorry, a giveaway can only last a maximum of 30 days.`);
                }



                const giveawayEmbed = new this.client.embed()
                    .setTitle('🎉 Giveaway! 🎉')
                    .setDescription(`Click the button to enter!\nEnds: <t:${Math.floor((actualTime + Date.now()) / 1000)}:R>\nGiveaway Host: ${member.mention}`)
                    .addField(`Prize`, `${prize}`)
                    .addField(`Requirements`, `Role Requirement: ${roleRequirement} \nVoice Requirement: ${voiceRequirement} \nServer Time: ${guildRequirement} \n\n`)
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
                        const role = subOptions.has("role-required") ? subOptions.get("role-required") : null;
                        const vc = subOptions.has("voice-time") ? ms(subOptions.get("voice-time")) : null;
                        const joinTime = subOptions.has("guild-time") ? ms(subOptions.get("guild-time")) : null;
                        const newSchema = new giveawaySchema({
                            guildID: interaction.guildID,
                            endTime: Date.now() + actualTime,
                            prize: prize,
                            winners: null,
                            messageID: m.id,
                            channelID: interaction.channel.id,
                            roleRequired: role,
                            voiceRequired: vc,
                            guildTime: joinTime,
                            giveawayHost: member.mention,
                        });
                        await newSchema.save();
                        await this.client.redis.set(`giveaway.${interaction.guildID}.${m.id}`, true, 'EX', actualTime / 1000);
                        interaction.createFollowup(`Successfully started the giveaway.`);
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

            case "delete": {
                const channelID = subOptions.get("channel");
                const messageID = subOptions.get("message-id");

                const data = (await giveawaySchema.findOne({ guildID: interaction.guildID, messageID: messageID }));
                if(!data) {
                    return interaction.createFollowup(`There doesn't seem to be a giveaway with that message ID.`);
                }
                await this.client.editMessage(channelID, messageID, { content: `*Giveaway deleted.*`, embeds: [], components: []}).catch((e) => {
                    return interaction.createFollowup(`Something seems to have gone wrong.. please ensure all information provided was correct.`);
                });

                interaction.createFollowup(`Successfully deleted that giveaway.`)

                await data.delete();

                break;
            }
        }



    }

}
