import Command from "../../Interfaces/Command";
import { stripIndents } from 'common-tags';
import FuzzySearch from 'fuse.js';
import constants from '../../Interfaces/Constants';
import { Paginate } from '@the-nerd-cave/paginate';
import paginationEmbed from 'eris-pagination';

export default class HelpCommand extends Command {
    constructor(client) {
        super(client, 'help', {
            aliases: ["commands", "cmds"],
            description: "Get help on Commands!",
            category: "Utility",
            guildOnly: true,
        });
    }
    async run(message, args) {

        const checkOrCross = (bool) =>
            bool ? constants.emojis.check : constants.emojis.x;

        const prefix = "!"
        const totalCommands = this.client.commands.size;
        const allCategories = [
            ...new Set(this.client.commands.map((cmd) => cmd.category)),
        ];


        const categories = allCategories.filter((_, idx) => allCategories[idx]);

        if (!args.length) {
            const mainEmbed = new this.client.embed()
                .setDescription(
                    `Prefix: ** ${prefix} **\n
                    Total Commands: **${totalCommands}**\n
                    [Support Server](https://discord.gg/FwBUBzBkYt)`,
                )

            for (const category of categories) {
                mainEmbed.addField(
                    `**${this.client.utils.capitalise(category)} [${
                        this.client.commands.filter((cmd) => cmd.category === category).size
                    }]**`,
                    `${prefix}help ${this.client.utils.capitalise(category)}`,
                    true
                );
            }
            // @ts-ignore
            return message.channel.createMessage({ embed: mainEmbed, messageReference: { messageID: message.id } });
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
            .setColor('#F00000');

        if (!match) {
            return message.channel.createMessage({ embed: noMatchEmbed, messageReference:  { messageID: message.id }});
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

            const pages = new Paginate(commandsToPaginate, 8)?.getPaginatedArray();

            const embeds = pages.map((page, index) => {

                return new this.client.embed()
                    .setTitle(`${this.client.utils.capitalise(item)}'s Help Menu`)
                    .setDescription(
                        // @ts-ignore
                        page ?? `No more Commands to be listed on page ${index + 1}`
                    )
                    .setTimestamp();
            });

            if(embeds.length <= 1) {
                return message.channel.createMessage({ embed: embeds[0] })
            }
            // @ts-ignore
            return await paginationEmbed.createPaginationEmbed(message, embeds, {});
        }

        const command =
            this.client.commands.get(item) ??
            this.client.commands.find(({ aliases }) => aliases.includes(item));

        if (!command) {
            const noMatchEmbed2 = new this.client.embed()
                .setDescription(
                    `No match found for that input. Please try an input closer to one of the command/category names.`
                )
                .setColor('#F00000');

            return await message.channel.createMessage({ embed: noMatchEmbed2, messageReference: { messageID: message.id }});
        }

        const commandEmbed = new this.client.embed()
            .setTimestamp()
            .setThumbnail(this.client.user.avatarURL)
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator}`)
            .setDescription(stripIndents`Name: ${command.name}`)

        return await message.channel.createMessage({ embed: commandEmbed, messageReference: { messageID: message.id }});

     }

    }
