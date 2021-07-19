import Command from "../../Interfaces/Command";

export default class VoiceDeafenCommand extends Command {
    constructor(client) {
        super(client, 'voicedeafen', {
            aliases: ["vdeaf"],
            description: "Mute a member in a VC. (Server mute)",
            category: "Moderation",
            botPerms: ['voiceMuteMembers'],
            userPerms: ['voiceMuteMembers'],
            modCommand: true,
        });
    }
    async run(message, args) {

        const member = await this.client.utils.getMember(message, args[0]);
        if(!member) return;
        if(!member?.voiceState.channelID)  return message.channel.createMessage({ content: `The member needs to be in a Voice Channel.`, messageReference: { messageID: message.id }});
        const reason = args.slice(1).length ? args.slice(1).join(" ") : 'No reason provided.';
        try {
            let t = false;
            if(member.voiceState.deaf) {
                member.edit({ deaf: false }, reason)
                t = true;
            } else {
                member.edit({ deaf: true}, reason);
            }
            return message.channel.createMessage({ content: `Successfully ${t ? 'un-' : ''}server deafened that member!`, messageReference: { messageID: message.id }});
        } catch (e) {
            console.log(e)
            return message.channel.createMessage({ content: `There was an error when deafening the member.`, messageReference: { messageID: message.id }});
        }

    }

}
