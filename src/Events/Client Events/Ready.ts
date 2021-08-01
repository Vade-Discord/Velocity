import { Event } from "../../interfaces/Event";
import mongo from '../../Interfaces/Database';
import { Lavalink } from "../../Interfaces/Lavalink";
import { promisify } from "util";
import playerSchema from '../../Schemas/Backend/Players';
import { VoiceChannel } from "eris";
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
                    if (channel instanceof VoiceChannel) {
                        channel.leave()
                    }
                    // @ts-ignore
                    let guild;
                    if ((channel instanceof VoiceChannel)) {
                        guild = await this.client.getRESTGuild(channel.guild.id);
                    }
                    if(!this.client.redis) {
                        await wait(1000);
                    }
                    const data = await this.client.redis.get(`queue.${guild.id}`);
                    const checkSchema =JSON.parse(data)
                    console.log(checkSchema)
                    if (checkSchema) {
                        console.log(checkSchema.voiceChannel)
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
                        const textChannel = await this.client.getRESTChannel(checkSchema.textChannel);
                        let reAddedEmbed = new this.client.embed()
                            .setAuthor(`Bot Restarted`, this.client.user.avatarURL)
                            .setDescription(`Looks like the bot restarted during your listening session!\n\nDon't worry, we're adding the songs back!`)
                            .setThumbnail(this.client.user.avatarURL)

                        textChannel
                            ?.createMessage({ embeds: [reAddedEmbed]});
                                checkSchema.queue.forEach(async (song) => {
                                   player.search(song)
                                    let res;
                                    try {
                                        res = await player.search(song, this.client.user);
                                    } catch (err) {
                                        return this.client.createMessage(checkSchema.textChannel, `There was an error while searching:\n\`${err.message}\``)
                                    }

                                    let embed = new this.client.embed();
                                    switch(res.loadType) {
                                        case "TRACK_LOADED":
                                            let enqueueTrack = res.tracks[0];
                                            if (!enqueueTrack.track) await enqueueTrack.resolve();
                                            await player.queue.add(enqueueTrack);

                                            if (!player.playing && !player.paused && !player.queue.length)
                                                player.play();
                                    }
                                });
                                await this.client.redis.del(`queue.${guild.id}`)

                    }
                });






            }
        }

    }




