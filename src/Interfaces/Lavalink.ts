import { Bot } from '../client/Client';
import { Manager } from 'erela.js';
import Spotify from "erela.js-spotify";
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";
import { Guild } from "eris";



export async function Lavalink(client: Bot) {

    const nodes: any = [
        {
            host: client.config.lavalink.host,
            password: client.config.lavalink.password,
            port: client.config.lavalink.port,
        },
    ];

    const clientID: string = client.config.lavalink.SPOTIFY_CLIENT_ID;
    const clientSecret: string = client.config.lavalink.SPOTIFY_SECRET_ID;

    client.manager = new Manager({
        nodes,
        plugins: [
            new Spotify({
                clientID,
                clientSecret,
            }),
            new Deezer({}),
            new Facebook(),
        ],
        autoPlay: true,
        send: (id, payload) => {
            const guild = client.guilds.get(id) as Guild;
            if(guild)  guild.shard.sendWS(payload.op, payload.d)
        },
    });

    client.manager.init(client.user.id);

    client.manager.on("nodeConnect", (node) => {
        client.logger.info(`Node "${node.options.identifier}" connected.`);
    });

    client.manager.on("nodeError", (node, error) => {
        client.logger.error(
            `Node "${node.options.identifier}" encountered an error: ${error.message}.`
        );
    });

    client.on("rawWS", (d) => client.manager.updateVoiceState(d));

    client.manager.on("trackStart", async (player, track, payload) => {

        if (
            client.autoplay.indexOf(payload.guildId) >= 0 &&
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
        let np = new client.embed()
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
                        : `🕒 ${client.utils.msConversion(track.duration)}`
                }`
            );

        let playingMessage;
        try {
            playingMessage = await client.createMessage(player.textChannel, {embed: np});
            // @ts-ignore
            player.npMessage = playingMessage.id;
        } catch (error) {
            console.error(error);
        }
    });
}