import Command from "../../Interfaces/Command";
import playlistSchema from "../../Schemas/Backend/PlaylistsSchemas";
import { TrackUtils } from "erela.js";
import {Track, UnresolvedTrack} from "erela.js/structures/Player";
import {Queue} from "erela.js/structures/Queue";

export default class PlaylistCommand extends Command {
    constructor(client) {
        super(client, 'playlist', {
            description: "Save a playlist for later, check your friends and more!",
            category: "Music",
            options: [
                {
                    type: 1,
                    name: "create",
                    description: "Create a playlist from the current queue!",
                    options: [
                        {
                            type: 3,
                            name: "name",
                            description: "The name of the playlist to create!",
                            required: true
                        },
                        {
                            type: 3,
                            name: "description",
                            description: "The description of the playlist to create!",
                            required: false
                        },
                        {
                            type: 5,
                            name: "public",
                            description: "Whether the playlist should be public or not! Default is false!",
                            required: false
                        }
                    ]
                },
                {
                    type: 1,
                    name: "load",
                    description: "Load a saved playlists!",
                    options: [
                        {
                            type: 3,
                            name: "playlist-name",
                            description: "The name of the playlist to load!",
                            required: true,
                        },
                        {
                            type: 5,
                            name: "shuffle",
                            description: "Whether the playlist should be shuffled or not! Default is false!",
                            required: false
                        },
                        {
                            type: 6,
                            name: "user",
                            description: "The user who's playlist you want to load (If it is not your own).",
                            required: false
                        }
                    ]
                },
                {
                    type: 1,
                    name: "delete",
                    description: "Delete one of your playlists.",
                    options: [
                        {
                            type: 3,
                            name: "playlist-name",
                            description: "The name of the playlist to delete!",
                            required: true,
                        }
                    ]
                }

            ],
            ephemeral: true
        });
    }
    async run(interaction, member, options, subOptions) {

        const subCommand = interaction.data.options;

        switch(subCommand[0].name) {

            case "create": {

                const name = subOptions.get("name");
                const description = subOptions.get("description") ?? "No description provided!";
                const p = !!subOptions.get("public");


                const player = this.client.manager.players.get(interaction.guildID);
                if(!player) {
                    return interaction.createMessage({ content: "There is nothing playing in the current server. Please play something first!", flags: 64 });
                }

                const voiceData = member.voiceState;
                if(!voiceData?.channelID || voiceData?.channelID !== player.voiceChannel) {
                    return interaction.createMessage({ content: "You must be in the same Voice Channel as the Bot in order to run this command.", flags: 64 });
                }
                if((await playlistSchema.findOne({ name: name, ownerID: member.id }))) {
                    return interaction.createMessage({ content: "A playlist with that name already exists!", flags: 64 } );
                }
                if((await playlistSchema.find({ ownerID: member.id })).length >= 5) {
                    return interaction.createMessage({ content: "You can only save up to 5 playlists!", flags: 64 } );
                }
                if(name.length > 32) {
                    return interaction.createMessage({ content: "The name of the playlist can only be up to 32 characters long!", flags: 64 } );
                }

                // @ts-ignore
                let queue: Queue | UnresolvedTrack[] | Track[] = player.queue;
                let current = player.queue.current;

                const promises = queue.map(async (t: UnresolvedTrack) => {
                    if (t.resolve) {
                        try {
                            await t.resolve();
                        } catch {
                            return null;
                        }
                    }
                    return t;
                });


                let waitEmbed = new this.client.embed()
                    .setTitle('⌛ Please wait...')
                    .setColor('YELLOW')
                    .setDescription('Trying to save the current queue into a playlist')
                    .setFooter('This might take a while')
                    .setTimestamp();

                await interaction.createMessage({ embeds: [waitEmbed], flags: 64 });

                const resolvedTracks = await Promise.all(promises);
                queue = resolvedTracks.filter((t) => !!t);

                let playlistSongs = [];
                let totalTime = 0;
                if (current) {
                    let mappedCurr = {
                        track: current.track,
                        title: current.title,
                        duration: current.duration,
                        uri: current.uri,
                    };
                    playlistSongs.push(mappedCurr);
                    totalTime += current.duration;
                }
                queue.forEach((track) => {
                    let mappedTrack = {
                        track: track.track,
                        title: track.title,
                        duration: track.duration,
                        uri: track.uri,
                    };
                    playlistSongs.push(mappedTrack);
                    totalTime += current.duration;
                });
                if (
                    playlistSongs.length > this.client.config.lavalink.MAX_PLAYLIST_SIZE &&
                    !this.client.owners.includes(member.id)
                ) {
                    playlistSongs = playlistSongs.slice(0, this.client.config.lavalink.MAX_PLAYLIST_SIZE);
                }

                const playlist = new playlistSchema({
                    name: name?.toLowerCase(),
                    description: description,
                    ownerID: member.id,
                    public: p,
                    playlistArray: playlistSongs,
                    uses: 0,
                    likes: 0,
                    dislikes: 0
                });

                await playlist.save();
                return interaction.createMessage({ content: "Playlist created successfully!", flags: 64 });


            }

            case "load": {


                const name = subOptions.get("playlist-name");
                const shuffle = !!subOptions.get("shuffle");
                const user = subOptions.get("user") ?? member.id;

                if(name.length > 32) {
                    return interaction.createMessage({ content: "The name of the playlist can only be up to 32 characters long!", flags: 64 } );
                }
                const foundPlaylist = (await playlistSchema.findOne({ name: name, ownerID: user }));
                if(!foundPlaylist) {
                    return interaction.createMessage({ content: "A playlist with that name does not exist!", flags: 64 } );
                }

                let player = this.client.manager.players.get(interaction.guildID);
                const voiceData = member.voiceState;
                if(!voiceData?.channelID) {
                    return interaction.createMessage({ content: "You must be in a Voice Channel in order to use this Command!", flags: 64 });
                }
                if(player && player.voiceChannel !== voiceData.channelID) {
                    return interaction.createMessage({ content: "You must be in the same Voice Channel as the Bot in order to run this command.", flags: 64 });
                }
                if(!player) {
                    player = this.client.manager.create({
                        guild: interaction.guildID,
                        voiceChannel: voiceData.channelID,
                        textChannel: interaction.channel.id,
                        selfDeafen: true,
                    });
                }

                let totalTime = 0;
                interaction.createMessage({ content: "Loading playlist...", flags: 64 });
                const encodeTrack = foundPlaylist.playlistArray.map((t: { track: any }) => t.track);
                let decodedTrack = (await this.client.utils.decodeTracks(encodeTrack));

                let tracks: Track[] = [];
                decodedTrack.forEach((track) => {
                    const buildTrack = TrackUtils.build(track, member);
                    tracks.push(buildTrack);
                    totalTime += buildTrack.duration;
                });

                if(!tracks.length) {
                    return interaction.createMessage({ content: "There are no tracks in this playlist!", flags: 64 });
                }

                if(!player.playing) {
                    player.connect();
                }

                try {
                    if (!player.queue.current) {
                        player.queue.current = tracks[0];
                        if (tracks.length) {
                            player.queue.add(tracks.slice(1));
                        }
                    } else {
                        player.queue.add(tracks);
                    }
                    if (!player.playing && !player.paused) {
                        player.play();
                    }
                } catch (error) {
                    this.client.logger.error(error);
                   return interaction.createMessage({ content: "An error occurred while loading the playlist!", flags: 64 });
                }

                let embed = new this.client.embed()
                    .setDescription(`✅ The playlist \`${name}\` has been added to the queue by ${member.mention}`)
                    .setColor(this.client.constants.colours.green)
                    .setTimestamp()
                    .setFooter(`Velocity Music`, this.client.user.avatarURL);

                interaction.createMessage({ embeds: [embed] });

                break;
            }

            case "delete": {
                const id = subOptions.get("playlist-name")?.toLowerCase();
                if(id.length > 32) {
                    return interaction.createMessage({ content: "The name of the playlist can only be up to 32 characters long!", flags: 64 } );
                }
                const playlist = await playlistSchema.findOne({ ownerID: member.id, name: id })
                if(!playlist) {
                    return interaction.createMessage({ content: "A playlist with that name does not exist! Please ensure you did not misspell!", flags: 64 });
                }
              await playlist.delete();
              return interaction.createMessage({ content: "Successfully deleted the playlist!", flags: 64 });

            }

            case "export": {

                const name = subOptions.get("playlist-name")?.toLowerCase();
                const user = subOptions.get("user") ?? member.id;


            }
        }


        }


    }