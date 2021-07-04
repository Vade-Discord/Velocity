import Command from "../../Interfaces/Command";

export default class StopCommand extends Command {
    constructor(client) {
        super(client, 'stop', {
            aliases: ["disconnect", "dc"],
            description: "Stop the music/Disconnect the Bot.",
            category: "Music",
        });
    }
    async run(message, args) {

        const player = this.client.manager.players.get(message.channel.guild.id);
        const voiceState = message.member.voiceState;
        const me = message.guild.members.get(this.client.user.id);
        if(!me.voiceState || !me.voiceState.channelID) return message.channel.createMessage({ content: `I am not connected to a Voice Channnel!`, messageReference: { messageID: message.id }});
        if(player) {
            if(!voiceState || voiceState.channelID !== player.voiceChannel) return message.channel.createMessage({ content: `You must be in the same Voice Channel as me to use this Command!`, messageReference: { messageID: message.id }});
            player.destroy()
            const channel = message.guild.channels.get(player.voiceChannel);
           let embed = new this.client.embed()
               .setDescription(`${message.author.mention} ⏹ stopped the music!`);
            return message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});
        }
        if(!voiceState || voiceState.channelID !== me.voiceState.channelID) return message.channel.createMessage({ content: `You must be in the same Voice Channel as me to use this Command!`, messageReference: { messageID: message.id }});
        const channel = message.guild.channels.get(me.voiceState.channelID);
        channel.leave();
        return message.channel.createMessage({ content: `Successfully disconnected!`, messageReference: { messageID: message.id }});
    }

}
