import Command from "../../Interfaces/Command";

export default class PlayCommand extends Command {
    constructor(client) {
        super(client, 'play', {
            description: "Play a song via name or url!",
            category: "Music",
            options: [
                {
                    type: 3,
                    name: 'input',
                    description: 'Either the song name or url.',
                    required: true,
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        let embed = new this.client.embed();
        const { channelID } = member.voiceState;
        const channel = channelID ? member.guild.channels.get(channelID) : null;

        if(!channel) {
            return interaction.createFollowup('You need to join a Voice Channel first!');
        }

        const player = this.client.manager.create({
            guild: interaction.guildID,
            voiceChannel: channelID,
            textChannel: interaction.channel.id,
            volume: this.client.config.lavalink.DEFAULT_VOLUME,
            selfDeafen: true,
        });

        if (!player.playing) {
            player.connect();
        }

        const search = options.get("input");
        let res;

        const me = member.guild.members.get(this.client.user.id);
        if (player.playing && channel.id !== me.voiceState.channelID) {
            return interaction.createFollowup(`You must be in the same channel as ${this.client.user.mention}`);
        }

        const permissions = channel.permissionsOf(this.client.user.id);
        if (!permissions.has("voiceConnect")) {
            return interaction.createFollowup("Cannot connect to voice channel, missing permissions");
        }
        if (!permissions.has("voiceSpeak")) {
            return interaction.createFollowup("I cannot speak in this voice channel, make sure I have the proper permissions!");
        }

        try {
            res = await player.search(search, interaction.member.user);
        } catch (err) {
            return interaction.createFollowup(`There was an error while searching:\n\`${err.message}\``);
        }

        switch (res.loadType) {
            case "LOAD_FAILED":
                if (!player.queue.current) {
                    player.destroy();
                }
                return interaction.createFollowup("There was an error while loading this song")

            case "NO_MATCHES":
                if (!player.queue.current) {
                    player.destroy();
                }
                return interaction.createFollowup("No results were found");

            case "TRACK_LOADED":
                let enqueueTrack = res.tracks[0];
                if (!enqueueTrack.track) await enqueueTrack.resolve();
                await player.queue.add(enqueueTrack);

                if (!player.playing && !player.paused && !player.queue.length)
                    player.play();

                embed
                    .setTitle("▶️ Enqueuing:")
                    .setColor("#00f2ff")
                    .setThumbnail(
                        `https://img.youtube.com/vi/${enqueueTrack.identifier}/mqdefault.jpg`
                    )
                    .setDescription(`\`${enqueueTrack.title}\`\n${enqueueTrack.uri}`)
                    .setFooter(
                        `🎤 ${enqueueTrack.author}  •  ${
                            enqueueTrack.isStream
                                ? `◉ LIVE`
                                : `🕒 ${this.client.utils.msConversion(enqueueTrack.duration)}`
                        }`
                    );

                return interaction.createFollowup({embeds: [embed]})
                    .then((msg) => setTimeout(() => {
                        msg.delete(`Search concluded.`)
                    }, 1000));

            case "PLAYLIST_LOADED":
                if (!res.tracks.length)
                    return interaction.createFollowup("That playlist doesn't contain any songs!");

                embed.setAuthor(
                    `${interaction.member.username} has ${
                        !player.queue.totalSize ? `started` : `added`
                    } a playlist`,
                    interaction.member.avatarURL
                );

                await player.queue.add(res.tracks);
                if (!player.playing && !player.paused) {
                    player.play();
                }

                embed
                    .setTitle(res.playlist.name)
                    .setDescription(
                        res.tracks
                            .slice(0, 8)
                            .map(
                                (track, index) =>
                                    `**\`${++index}.\`**\`| [${this.client.utils.msConversion(
                                        track.duration
                                    )}]\` - [${track.title}](${track.uri})`
                            ).join("\n") + `\n\nCheck the entire playlist with \`/queue\` command`
                    )
                    .setFooter(
                        `🎵 ${res.tracks.length}  •  🕒 ${this.client.utils.msConversion(
                            res.playlist.duration
                        )}`
                    );
                return interaction.createFollowup({embeds: [embed]});

            case "SEARCH_RESULT":
                let index = 0;
                let searchEmbed;

                embed.setDescription("Loading track...");
                searchEmbed = await interaction.createFollowup({embeds: [embed]});


                const track = res.tracks[index];
                await player.queue.add(track);

                if (!player.playing && !player.paused && !player.queue.length) {
                    player.play();
                }

                embed
                    .setColor("#00f2ff")
                    .setAuthor("")
                    .setTitle("▶️ Enqueuing:")
                    .setThumbnail(
                        `https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`
                    )
                    .setDescription(`\`${track.title}\`\n${track.uri}`)
                    .setFooter(
                        track.isStream
                            ? `◉ LIVE`
                            : `🕒 ${this.client.utils.msConversion(track.duration)}`
                    );

                return searchEmbed.edit({embeds: [embed]});

        }






    }

}
