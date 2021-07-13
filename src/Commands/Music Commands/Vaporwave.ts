import Command from "../../Interfaces/Command";

export default class VaporwaveCommand extends Command {
    constructor(client) {
        super(client, 'vaporwave', {
            aliases: ["vw"],
            description: "Enable vaporwave!",
            category: "Music",
        });
    }
    async run(message, args) {

        const player = this.client.manager.players.get(message.channel.guild.id);
        const voiceState = message.member.voiceState;

        const me = message.guild.members.get(this.client.user.id);
        if(!me.voiceState || !me.voiceState.channelID) return message.channel.createMessage({ content: `I am not connected to a Voice Channnel!`, messageReference: { messageID: message.id }});
        if(!voiceState || voiceState.channelID !== me.voiceState.channelID) return message.channel.createMessage({ content: `You must be in the same Voice Channel as me to use this Command!`, messageReference: { messageID: message.id }});
        if(!player) return message.channel.createMessage({ content: `Nothing seems to be playing.`, messageReference: { messageID: message.id }});
        player.vaporwave ? player.vaporwave = false : player.vaporwave = true;
        let embed = new this.client.embed()
            .setDescription(`${message.author.mention} 🎵 ${player.vaporwave ? `enabled` : `disabled`} vaporwave!`)
            .setColor('#ffffff');
        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});


    }

}
