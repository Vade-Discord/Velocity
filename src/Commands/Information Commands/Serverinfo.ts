import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";

export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "serverinfo", {
      aliases: ["servinfo", "si"],
      description: "View the server information!",
      category: "Information",
      guildOnly: true,
    });
  }
  async run(message, args) {
    const onlineEmoji = "<a:online:837510797541507072>";
    const idleEmoji = "<a:idle:837510813438705666>";
    const dndEmoji = "<a:dnd:837510814411390986>";
    const offlineEmoji = "<a:offline:837510814985879573>";

    const online = message.channel.guild.members.filter(
      (m) => m.status === "online"
    )?.length;
    const idle = message.channel.guild.members.filter(
      (m) => m.status === "idle"
    )?.length;
    const dnd = message.channel.guild.members.filter(
      (m) => m.status === "dnd"
    )?.length;
    const offline = message.channel.guild.members.filter(
      (m) => !m.status || m.status === "offline"
    )?.length;

    const totalRoles = message.channel.guild.roles.size;

    const embed = new RichEmbed()
      .setTitle(`${message.guild.name}'s Server Information`)
      .addField(
        "Owner Info",
        `Guild Owner: <@${message.channel.guild.ownerID}> (${message.channel.guild.ownerID})`
      )
      .addField(
        "Member Info",
        `Total: ${message.channel.guild.memberCount}\n\n${onlineEmoji} Online: ${online}\n${idleEmoji} Idle: ${idle}\n${dndEmoji} Do not Disturb: ${dnd}\n${offlineEmoji} Offline: ${offline}`
      )
      .addField("Role Info", `Roles: ${totalRoles}`)
      .addField("General Info", `Placeholder`)
      .setColor("#f3f0f0")
      .setFooter(`Vade | Server Information`, this.client.user.avatarURL)
      .setTimestamp();

    message.channel.createMessage({ embed: embed });
  }
}
