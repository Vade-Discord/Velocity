import Command from "../../Interfaces/Command";

export default class SkipCommand extends Command {
    constructor(client) {
        super(client, 'skip', {
            aliases: ["s"],
            description: "Skip a song.",
            category: "Music",
            guildOnly: true,
        });
    }
    async run(message, args) {

        const player = this.client.manager.players.get(message.guildID);
        if(!player) return message.channel.createMessage({ content: `There is nothing playing.`, messageReference: { messageID: message.id }});
        let embed = new this.client.embed()
            .setDescription(`${message.author.mention} ⏭ skipped [${player.queue.current.title}](${player.queue.current.uri})`)

        message.channel.createMessage({ embed: embed, messageReference: { messageID: message.id }});
        player.stop();


     }

    }
