import { Event } from "../../interfaces/Event";
import mongo from '../../Interfaces/Database';
import { Lavalink } from "../../Interfaces/Lavalink";
import { promisify } from "util";
import playerSchema from '../../Schemas/Backend/Players';
import { PrivateChannel } from "eris";
import redis from '../../Interfaces/Redis';
const wait = promisify((setTimeout));
import { TrackUtils } from 'erela.js'


export default class ReadyEvent extends Event {
        constructor(client) {
            super(client, "ready", {
                once: true,
            });
        }

        async run() {
            await mongo();
            await Lavalink(this.client);
            this.client.redis = await redis();

            console.log(`${this.client.user.username}${this.client.user.discriminator} has successfully logged in!`);
            this.client.editStatus('online', { name: "Vade Rewrite", type: 5, url: "https://vade-bot.com"});

            // Handle existing voice connections.

            await wait(1000);
            if(this.client.voiceConnections.size >= 1) {
                // @ts-ignore
                this.client.voiceConnections.forEach( async (one) => {
                    const channel = await this.client.getRESTChannel(one.channelID);
                    // @ts-ignore
                    let guild;
                    if (!(channel instanceof PrivateChannel)) {
                        guild = await this.client.getRESTGuild(channel.guild.id);
                    }
                    const checkSchema = await playerSchema.findOne({guild: guild.id});
                    if (checkSchema) {
                        const queue = checkSchema.queue;
                                const player = await this.client.manager.create({
                                    guild: guild.id,
                                    voiceChannel: channel.id,
                                    textChannel: checkSchema.textChannel,
                                    volume: this.client.config.lavalink.DEFAULT_VOLUME,
                                    selfDeafen: true,
                                });
                        if(!player.playing) {
                            player.connect()
                        }
                                checkSchema.queue.forEach(async (song) => {
                                    const data = await TrackUtils.buildUnresolved(song, this.client.user);
                                   await player.queue.add(data);

                                });
                        player.queue.current = player.queue.shift()
                        // if(!player.queue.current) player.queue.shift();
                        player.play()
                      //  if (!player.playing && !player.paused && !player.queue.length) player.play();
                                await checkSchema.delete();




                    }
                });






            }
        }

    }




