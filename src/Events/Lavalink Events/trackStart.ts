import { Event } from '../../Interfaces/Event';


export default class TrackStartEvent extends Event {
    constructor(client) {
        super(client, "trackStart", {
        emitter: "manager",
        });
    }

    async run(player, track, payload) {

        console.log(`Track start event is being fired`)

        if (
            this.client.autoplay.indexOf(payload.guildId) >= 0 &&
            !player.queue.length &&
            !player.trackRepeat &&
            !player.queueRepeat
        ) {
            let res = await player.search(
                `https://www.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`,
                track.requester
            );
            await player.queue.add(res.tracks.filter((t) => t.identifier !== track.identifier));
        }
        //Embed sent after the track starts playing.
        let np = new this.client.embed()
            .setTitle("🎵 Now Playing:")
            // @ts-ignore
            .setDescription(
                `[${track.title}](${track.uri})\nRequested by: [ ${
                    // @ts-ignore
                    track.requester?.id ? track.requester.mention : `<@${track.requester.id}>`
                } ]`
            )
            .setThumbnail(
                `https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`
            )
            .setFooter(
                `🎤 ${track.author}  •  ${
                    track.isStream
                        ? `◉ LIVE`
                        : `🕒 ${this.client.utils.msConversion(track.duration)}`
                }`
            );

        let playingMessage;
        try {
            playingMessage = await this.client.createMessage(player.textChannel, {embeds: [np]});
            // @ts-ignore
            player.npMessage = playingMessage.id;
            const checkSchema = await this.client.redis.get(`queue.${player.guild}`);
            if(checkSchema) {
                await this.client.redis.del(`queue.${player.guild}`)
            }
            if(player.queue.length) {
                const data = {
                    guild: player.guild,
                    queue: player.queue.map(t => t.uri),
                    length: player.queue.length,
                    textChannel: player.textChannel,
                    voiceChannel: player.voiceChannel
                }
                await this.client.redis.set(`queue.${player.guild}`, JSON.stringify(data));
            }
        } catch (error) {
            console.error(error);
        }


    }

}