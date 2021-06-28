import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
import main_schema from "../../Schemas/Main Guilds/GuildSchema";
export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "color", {
      aliases: ["test", "test"],
      description: "View the server information!",
      category: "Development",
      guildOnly: true,
    });
  }
  async run(message, args) {
    const locate_schema = await main_schema.findOne({
      guildID: message.guild.id,
    });
    await locate_schema.updateOne({
      bumpColour: args[0],
    });

    message.channel.createMessage(
      `Successfully set your hex colour to \`   ${args[0]}\``
    );
  }
}
