import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import main_schema from "../../Schemas/Main Guilds/GuildSchema";
export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "play", {
      aliases: ["test", "test"],
      description: "View the server information!",
      category: "Development",
      guildOnly: true,
    });
  }
  async run(message, args) {
    const youtube = this.client.music.getYouTube();
    const voiceChannel = message.member.voiceState;
    if (!voiceChannel.channelID)
      return message.channel.createMessage(
        `You must be in a Voice Channel to use the command.`
      );
    if (!args.join(" "))
      return message.channel.createMessage(
        ` You must provide a Search Query or an URL to use the command.`
      );

    if (
      /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/.test(args[0])
    ) {
      const playlist = await youtube.getPlaylist(args[0]);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        try {
          const vid = await youtube.getVideoByID(video.id);
          await this.client.music.handleVideo(vid, message, voiceChannel, true);
        } catch (e) {
          continue;
        }
      }
      return message.channel.createMessage(
        ` **${playlist.title}**: has been added to queue`
      );
    }

    try {
      const video = await youtube.getVideo(args[0]);
      return await this.client.music.handleVideo(video, message, voiceChannel);
    } catch (e) {
      const videos = await youtube.searchVideos(args.join(" "), 1);
      if (!videos.length)
        return message.channel.createMessage(` No result found `);
      const video = await youtube.getVideoByID(videos[0].id);
      return await this.client.music.handleVideo(video, message, voiceChannel);
    }
  }
}
