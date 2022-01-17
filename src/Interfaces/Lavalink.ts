import { Bot } from '../Client/Client';
import { Manager } from 'erela.js';
import Spotify from 'better-erela.js-spotify';
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";
import AppleMusic from 'better-erela.js-apple';
import { Guild } from "eris";
import Filter from "erela.js-filters";
import playerSchema from '../Schemas/Backend/Players';



export async function Lavalink(client: Bot) {

    const nodes: any = [
        {
            host: client.config.lavalink.host,
            password: client.config.lavalink.password,
            port: client.config.lavalink.port,
        },
    ];

    const clientId: string = client.config.lavalink.SPOTIFY_CLIENT_ID;
    const clientSecret: string = client.config.lavalink.SPOTIFY_SECRET_ID;

    client.manager = new Manager({
        nodes,
        plugins: [
            new Spotify({
                strategy: 'API',
                clientId,
                clientSecret,
            }),
            new Deezer({}),
            new Facebook(),
            new Filter(),
            new AppleMusic()
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

    // @ts-ignore
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
            playingMessage = await client.createMessage(player.textChannel, {embeds: [np]});
            // @ts-ignore
            player.npMessage = playingMessage.id;
            const checkSchema = await client.redis.get(`queue.${player.guild}`);
            if(checkSchema) {
              await client.redis.del(`queue.${player.guild}`)
            }
        if(player.queue.length) {
            const data = {
                guild: player.guild,
                queue: player.queue.map(t => t.uri),
                length: player.queue.length,
                textChannel: player.textChannel,
                voiceChannel: player.voiceChannel
            }
            await client.redis.set(`queue.${player.guild}`, JSON.stringify(data));
        }
        } catch (error) {
            console.error(error);
        }

    });

    client.manager.on("playerMove", async (player, currentChannel, newChannel) => {
        if(!newChannel) {
            player.destroy();
        } else {
            if(!player.paused) {
                player.voiceChannel = newChannel;
                player.pause(true);
                let embed = new client.embed()
                    .setTitle("⏸ The music is now paused")
                    .setDescription(
                        `Voice channel changed, use \`/resume\` to resume the music`
                    );
                const channel = client.getChannel(
                    player.textChannel
                )
                if(channel.type !== 0) return;
                return channel.createMessage({ embeds: [embed] });

            }
        }

    });

}