import malScraper from "mal-scraper";
import Command from "../../Interfaces/Command";
import { RichEmbed } from "eris";
export default class ServerinfoCommand extends Command {
  constructor(client) {
    super(client, "anime", {
      //   aliases: ["test", "test"],
      description: "Search for a specifc anime character!",
      category: "Utility",
      guildOnly: true,
    });
  }
  async run(message, args) {
    const search = `${args}`;
    if (!search)
      return message.channel.createMessage("Please provide a search query!");

    malScraper.getInfoFromName(search).then((data) => {
      const malEmbed = new RichEmbed()
        .setAuthor(`Anime List search result for ${args}`.split(",").join(" "))
        .setThumbnail(data.picture)
        .addField("Premiered", `\`${data.premiered}\``, true)
        .addField("Broadcast", `\`${data.broadcast}\``, true)
        .addField("Genres", `\`${data.genres}\``, true)
        .addField("English Title", `\`${data.englishTitle}\``, true)
        .addField("Japanese Title", `\`${data.japaneseTitle}\``, true)
        .addField("Type", `\`${data.type}\``, true)
        .addField("Episodes", `\`${data.episodes}\``, true)
        .addField("Rating", `\`${data.rating}\``, true)
        .addField("Aired", `\`${data.aired}\``, true)
        .addField("Score", `\`${data.score}\``, true)
        .addField("Favorite", `\`${data.favorites}\``, true)
        .addField("Ranked", `\`${data.ranked}\``, true)
        .addField("Duration", `\`${data.duration}\``, true)
        .addField("Studios", `\`${data.studios}\``, true)
        .addField("Popularity", `\`${data.popularity}\``, true)
        .addField("Members", `\`${data.members}\``, true)
        .addField("Score Stats", `\`${data.scoreStats}\``, true)
        .addField("Source", `\`${data.source}\``, true)
        .addField("Synonyms", `\`${data.synonyms}\``, true)
        .addField("Status", `\`${data.status}\``, true)
        .addField("Identifier", `\`${data.id}\``, true)
        .addField("Link", data.url, true)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`);

      message.channel.createMessage({ embed: malEmbed });
    });
  }
}
