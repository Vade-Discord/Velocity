import Command from "../../Interfaces/Command";

export default class MoveCommand extends Command {
    constructor(client) {
        super(client, 'move', {
            aliases: ["movevc"],
            description: "Move either a single member of every member of a VC to another VC.",
            category: "Moderation",
            userPerms: ['voiceMoveMembers'],
            botPerms: ['voiceMoveMembers'],
            modCommand: true,
        });
    }
    async run(message, args) {

        if(!args.length) {
            return message.channel.createMessage({ content: `You need to provide either a member or "all".`, messageReference: { messageID: message.id }});
        }

        if(args[0]?.toLowerCase() === 'all') {
            if(!args[1]) {
                return message.channel.createMessage({ content: `You need to provide a channel that you would like to move the members FROM.`, messageReference: { messageID: message.id }});
            }

            const channel = await this.client.utils.getChannel(args[1], message.channel.guild, 2);

            if(!channel) {
                return message.channel.createMessage({ content: `I was unable to locate the channel that you provided. Please try again.`, messageReference: { messageID: message.id }});
            }

            if(channel.type !== 2) {
                return message.channel.createMessage({ content: `The channel that you provided doesn't seem to be a Voice Channel. Please try again. (FROM)`, messageReference: { messageID: message.id }});
            }

            if(!args[2]) {
                return message.channel.createMessage({ content: `You need to provide a channel that you would like to move the members TO.`, messageReference: { messageID: message.id }});
            }

            const channel2 = await this.client.utils.getChannel(args[2], message.channel.guild, 2);

            if(!channel2) {
                return message.channel.createMessage({ content: `I was unable to locate the channel that you provided. Please try again. (TO)`, messageReference: { messageID: message.id }});
            }

            if(channel2.type !== 2) {
                return message.channel.createMessage({ content: `The channel that you provided doesn't seem to be a Voice Channel. Please try again.`, messageReference: { messageID: message.id }});
            }

            const channelMembers = channel.voiceMembers;
            if(channelMembers.size < 1) {
                return message.channel.createMessage({ content: `There doesnt appear to be anyone in that Voice Channel.`, messageReference: { messageID: message.id }});
            }

            let members = [];

            channelMembers.forEach((m) => {
                m.edit({
                    channelID: channel2.id
                });
                members.push(m.id);
            });

            return message.channel.createMessage({ content: `Successfully moved ${members.length} members to: ${channel2.mention}`, messageReference: { messageID: message.id }});



        }

        const member = await this.client.utils.getMember(message, args[0], 2);
        if(!member) return;
        if(!member.voiceState.channelID) {
            return message.channel.createMessage({ content: `The member needs to be in a Voice Channel.`, messageReference: { messageID: message.id }});
        }
        if(!args[1]) {
            return message.channel.createMessage({ content: `You need to provide a channel that you would the member to be moved to.`, messageReference: { messageID: message.id }});
        }
        const channel = await this.client.utils.getChannel(args[1], message.channel.guild, 2);
        if(!channel) {
            return message.channel.createMessage({ content: `I was unable to locate the channel that you provided. Please try again.`, messageReference: { messageID: message.id }});
        }


        if(channel.type !== 2) {
            return message.channel.createMessage({ content: `The channel that you provided doesn't seem to be a Voice Channel. Please try again.`, messageReference: { messageID: message.id }});
        }

        try {
            member.edit({
                channelID: channel.id
            });
            return message.channel.createMessage({ content: `Successfully moved the member to: ${channel.mention}`, messageReference: { messageID: message.id }});
        } catch (e) {
            return message.channel.createMessage({ content: `An error seems to have occured..`, messageReference: { messageID: message.id }});
        }





     }

    }
