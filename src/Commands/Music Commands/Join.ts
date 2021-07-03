import Command from "../../Interfaces/Command";
import { VoiceChannel } from "eris";

export default class JoinCommand extends Command {
  constructor(client) {
    super(client, "join", {
      aliases: ["joinvc"],
      description: "Have the Bot join your Voice Channel!",
      category: "Music",
    });
  }
  async run(message, args) {
    const channel = message.member?.voiceState.channelID;
    if (!channel)
      return message.channel.createMessage({
        content: `You need to be in a Voice Channel to use this Command!`,
        messageReference: { messageID: message.id },
      });
    const getChannel = message.channel.guild.channels.get(channel);
    if (!getChannel)
      return message.channel.createMessage({
        content: `An error occured whilst fetching the channel.`,
        messageReference: { messageID: message.id },
      });
    await getChannel.join();
  }
}
