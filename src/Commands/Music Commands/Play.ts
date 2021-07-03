import Command from "../../Interfaces/Command";

export default class PlayCommand extends Command {
  constructor(client) {
    super(client, "play", {
      aliases: ["p", "playsong"],
      description: "Play a song!",
      category: "Music",
      guildOnly: true,
    });
  }
  async run(message, args) {

    const prefix = this.client.config.prefix;

    let embed = new this.client.embed();

    const { channelID } = message.member.voiceState;
    const channel = channelID ? message.channel.guild.channels.get(channelID) : null;
    if (!channel)
      return message.channel.createMessage({ content: "You need to join a voice channel first!", messageReference: { messageID: message.id }});

    const player = this.client.manager.create({
      guild: message.channel.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      volume: this.client.config.lavalink.DEFAULT_VOLUME,
      selfDeafen: true,
    });

    if (!player.playing) {
      player.connect();
    }
    const search = args.join(" ");
    let res;

    if (player.playing && channel.id !== message.guild.me.voice.channel.id)
      return message.channel.createMessage({ content: `You must be in the same channel as ${this.client.user.mention}`, messageReference: { messageID: message.id }});

    if (!args.length)
      return message.channel.createMessage({ content: `Usage: \`${prefix}play <YouTube URL | Video Name | Soundcloud URL>\``, messageReference: { messageID: message.id }});

    const permissions = channel.permissionsOf(this.client.user.id);
    if (!permissions.has("voiceConnect"))
      return message.channel.createMessage({ content: "Cannot connect to voice channel, missing permissions", messageReference: { messageID: message.id }});

    if (!permissions.has("voiceSpeak"))
    return message.channel.createMessage({ content: "I cannot speak in this voice channel, make sure I have the proper permissions!", messageReference: { messageID: message.id }});

    try {
      res = await player.search(search, message.author);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
      }
    } catch (err) {
  return message.channel.createMessage({ content: `There was an error while searching:\n\`${err.message}\``, messageReference: { messageID: message.id }});
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return message.channel.createMessage({ content: "No results were found", messageReference: { messageID: message.id }});

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

        return message.channel
            .send(embed)
            .then((msg) => msg.delete({timeout: 10 * 1000}));

      case "PLAYLIST_LOADED":
        if (!res.tracks.length)
          return this.client.utils.sendError(
              "That playlist doesn't contain any songs!",
              message.channel
          );
        embed.setAuthor(
            `${message.author.username} has ${
                !player.queue.totalSize ? `started` : `added`
            } a playlist`,
            message.author.displayAvatarURL()
        );

        await player.queue.add(res.tracks);
        if (!player.playing && !player.paused) player.play();

        embed
            .setTitle(res.playlist.name)
            .setDescription(
                res.tracks
                    .slice(0, 10)
                    .map(
                        (track, index) =>
                            `**\`${++index}.\`**\`| [${this.client.utils.msConversion(
                                track.duration
                            )}]\` - [${track.title}](${track.uri})`
                    )
            )
            .setFooter(
                `🎵 ${res.tracks.length}  •  🕒 ${this.client.utils.msConversion(
                    res.playlist.duration
                )}`
            );

        embed.description =
            embed.description +
            `\n\nCheck the entire playlist with \`${prefix}queue\` command`;

        return message.channel.send(embed);

      case "SEARCH_RESULT":
        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = arg.shift().toLowerCase();

        let index = 0;
        let searchEmbed;

        if (commandName === "search") {
          let max = 10,
              collected,
              filter = (m) =>
                  m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
          if (res.tracks.length < max) max = res.tracks.length;

          const results = res.tracks
              .slice(0, max)
              .map(
                  (track, index) =>
                      `**\`${++index}.\`**\`| [${this.client.utils.msConversion(
                          track.duration
                      )}]\` - [${track.title}](${track.uri})`
              )
              .join("\n");

          embed
              .setAuthor(
                  "Please choose a number from the list of songs below",
                  message.author.displayAvatarURL()
              )
              .setDescription(results)
              .setFooter("You have 30 seconds to select, or type end to cancel");

          searchEmbed = await message.channel.send(embed);

          try {
            collected = await message.channel.awaitMessages(filter, {
              max: 1,
              time: 30 * 1000,
              errors: ["time"],
            });
          } catch (e) {
            if (!player.queue.current) player.destroy();

            embed
                .setFooter("")
                .setDescription("You didn't provide a selection")
                .setAuthor("");
            return searchEmbed.edit(embed);
          }

          const first = collected.first().content;
          collected.first().delete();
          if (first.toLowerCase() === "end") {
            if (!player.queue.current) player.destroy();
            embed
                .setFooter("")
                .setDescription("Cancelled selection")
                .setAuthor("");

            return searchEmbed.edit(embed);
          }

          index = Number(first) - 1;
          if (index < 0 || index > max - 1)
            return message.channel.createMessage({
              content: `The number you provided too small or too big (1-${max})`,
              messageReference: {messageID: message.id}
            });
        } else {
          embed.setDescription("Loading track...");
          searchEmbed = await message.channel.createMessage({embed: embed});
        }

        const track = res.tracks[index];
        await player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
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

        return searchEmbed.edit({embed: embed});

    }


  }
}
