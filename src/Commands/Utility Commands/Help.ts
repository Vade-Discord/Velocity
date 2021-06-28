import Command from "../../Interfaces/Command";
import { stripIndents } from "common-tags";
import FuzzySearch from "fuse.js";
import constants from "../../Interfaces/Constants";
import { Paginate } from "@the-nerd-cave/paginate";
import { createPaginationEmbed } from "../../Classes/Pagination";

export default class HelpCommand extends Command {
<<<<<<< HEAD
  constructor(client) {
    super(client, "help", {
      aliases: ["commands", "cmds"],
      description: "Get help on Commands!",
      category: "Utility",
    });
  }
  async run(message, args) {
    const checkOrCross = (bool) =>
      bool ? constants.emojis.check.mention : constants.emojis.x.mention;

    const prefix = "-";
    const totalCommands = this.client.commands.size;
    const allCategories = [
      ...new Set(this.client.commands.map((cmd) => cmd.category)),
    ];

    const categories = allCategories.filter((_, idx) => allCategories[idx]);

    if (!args.length) {
      const mainEmbed = new this.client.embed().setDescription(
        `Prefix: ** ${prefix} **\n
=======
    constructor(client) {
        super(client, 'help', {
            aliases: ["commands", "cmds"],
            description: "Get help on Commands!",
            category: "Utility",
        });
    }
    async run(message, args) {

        const checkOrCross = (bool) =>
            bool ? constants.emojis.check.mention : constants.emojis.x.mention;

        const prefix = "-"
        const totalCommands = this.client.commands.size;
        const allCategories = [
            ...new Set(this.client.commands.map((cmd) => cmd.category)),
        ];

        const categories = allCategories.filter((_, idx) => allCategories[idx]);

        if (!args.length) {
            const mainEmbed = new this.client.embed()
                .setDescription(
                    `Prefix: ** ${prefix} **\n
>>>>>>> 71a094fb5e31384015414db07988236af2e00f8e
                    Total Commands: **${totalCommands}**\n
                    [Support Server](https://discord.gg/FwBUBzBkYt)  **|** [Website](https://vade-bot.com) **|**  [Dashboard](https://vade-bot.com/dashboard)`
      );
      for (const category of categories) {
        mainEmbed.addField(
          `**${this.client.utils.capitalise(category)} [${
            this.client.commands.filter((cmd) => cmd.category === category).size
          }]**`,
          `${prefix}help ${this.client.utils.capitalise(category)}`,
          true
        );
      }
      return message.channel.createMessage({
        embed: mainEmbed,
        messageReference: { messageID: message.id },
      });
    }

    const input = args.join(" ");

    const allCommands = this.client.commands
      .map((cmd) => [cmd.name, ...(cmd.aliases || [])])
      .flat();

    const result = new FuzzySearch(allCategories.concat(allCommands), {
      isCaseSensitive: false,
      includeScore: false,
      shouldSort: true,
      includeMatches: true,
      findAllMatches: false,
      minMatchCharLength: 1,
      location: 0,
      threshold: 0.6,
      distance: 100,
      useExtendedSearch: false,
      ignoreLocation: false,
      ignoreFieldNorm: false,
    }).search(input);

    const [match] = result;
    const noMatchEmbed = new this.client.embed()
      .setDescription(
        `No match found for that input. Please try an input closer to one of the command/category names.`
      )
      .setColor("#F00000");

    if (!match) {
      return message.channel.createMessage({
        embed: noMatchEmbed,
        messageReference: { messageID: message.id },
      });
    }

    const { item } = match;

    if (allCategories.includes(item)) {
      const commandsToPaginate = this.client.commands
        .filter((cmd) => cmd.category === item)
        .map(
          (command) =>
            `**${this.client.utils.capitalise(command.name)}**\n${
              command.description
            }\n`
        );
      const pages = new Paginate(commandsToPaginate, 8).getPaginatedArray();
      const embeds = pages.map((page, index) => {
        return new this.client.embed()
          .setTitle(`${this.client.utils.capitalise(item)}'s Help Menu`)
          .setDescription(
            page.join("\n") ??
              `No more Commands to be listed on page ${index + 1}`
          )
          .setTimestamp();
      });

      if (embeds.length <= 1) {
        return message.channel.createMessage({ embed: embeds[0] });
      }
      return await createPaginationEmbed(message, embeds, {});
    }
    const command =
      this.client.commands.get(item) ??
      this.client.commands.find(({ aliases }) => aliases.includes(item));

    if (!command) {
      const noMatchEmbed2 = new this.client.embed()
        .setDescription(
          `No match found for that input. Please try an input closer to one of the command/category names.`
        )
        .setColor("#F00000");

      return message.channel.createMessage({
        embed: noMatchEmbed2,
        messageReference: { messageID: message.id },
      });
    }
    const commandEmbed = new this.client.embed()
      .setTimestamp()
      .setThumbnail(this.client.user.avatarURL)
      .setDescription(
        `**❯** Name: **${command.name}**
            **❯** Description: **${command.description}**
            **❯** Aliases: **${command.aliases.join(", ") ?? "None"}**
            **❯** Member Permissions: **${
              this.client.utils.cleanPerms(command.userPerms) ??
              "No permissions needed."
            }**
            **❯** Bot Permissions: **${
              this.client.utils.cleanPerms(command.botPerms) ??
              "No permissions needed."
            }**
            `
      )
      .setFooter(
        `Requested by ${message.author.username}#${message.author.discriminator}`,
        message.author.avatarURL
      );

    await message.channel.createMessage({
      embed: commandEmbed,
      messageReference: { messageID: message.id },
    });
  }
}
