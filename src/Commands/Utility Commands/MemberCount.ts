import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "membercount", {
      description: "View the Servers member count!",
      category: "Utility",
      guildOnly: true,
    });
  }
  async run(message, args) {
    let embed = new RichEmbed()
      .setTitle(`${message.guild.name}'s member count`)
      .setDescription(`Members: **${message.channel.guild.memberCount}**`)
      .setFooter(`Vade | MemberCount`);

    return message.channel.createMessage({ embed: embed });
  }
}
