import { Event } from '../../Interfaces/Event';


export default class PlayerMoveEvent extends Event {
    constructor(client) {
        super(client, "playerMove", {
        emitter: "manager",
        });
    }

    async run(player, currentChannel, newChannel) {

        if(!newChannel) {
            player.destroy();
        } else {
            if(!player.paused) {
                player.voiceChannel = newChannel;
                player.pause(true);
                let embed = new this.client.embed()
                    .setTitle("⏸ The music is now paused")
                    .setDescription(
                        `Voice channel changed, use \`/resume\` to resume the music`
                    );
                const channel = this.client.getChannel(
                    player.textChannel
                )
                if(channel.type !== 0) return;
                return channel.createMessage({ embeds: [embed] });

            }
        }


    }

}