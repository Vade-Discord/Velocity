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
            if(guild) guild.shard.ws.send(payload.op, payload.d);
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

    client.on("raw", (d) => client.manager.updateVoiceState(d));

}