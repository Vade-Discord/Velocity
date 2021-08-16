import Command from "../../Interfaces/Command";
import { Paginate } from "@the-nerd-cave/paginate";
import { createPaginationEmbed } from "../../Classes/Pagination";
import FuzzySearch from 'fuse.js'

export default class PingCommand extends Command {
    constructor(client) {
        super(client, 'help', {
            aliases: [""],
            description: "Get help with the bot!",
            category: "Core",
            options: [
                {
                    type: 3,
                    name: 'query',
                    description: `What you would like to search for (command name/category name)`,
                    required: false,
                }]
        });
    }

    async run(interaction, member) {
        console.dir(interaction.data.options)
        const cmd = interaction.data.options?.filter(m => m.name === "query")[0]?.value;
        console.log(cmd)
        const allCategories = [
            ...new Set(this.client.commands.map((cmd) => cmd.category.toLowerCase())),
        ];

        const categories = allCategories.filter((_, idx) => allCategories[idx]);
        if (!cmd) {
            //const websiteButton = this.client.utils.createButton(interaction, 'Website', 5, 'https://vade-bot.com', 'help#websiteurl');
            const prefix = "/"
            const totalCommands = this.client.commands.size;


            const mainEmbed = new this.client.embed().setDescription(
                //`Prefix: ** ${prefix} **\n
                `Total Commands: **${totalCommands}**\n
                    [Support Server](https://discord.gg/FwBUBzBkYt)  **|** [Website](https://vade-bot.com) **|**  [Dashboard](https://vade-bot.com/dashboard)`
            );
            for (const category of categories) {
                mainEmbed.addField(
                    `**${this.client.utils.capitalise(category)} [${this.client.commands.filter((cmd) => cmd.category?.toLowerCase() === category).size
                    }]**`,
                    `${prefix}help ${this.client.utils.capitalise(category)}`,
                    true
                );
            }

            return interaction.createFollowup({
                embeds: [mainEmbed],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 5,
                        label: "Website",
                        url: `https://vade-bot.com`,
                    }]
                }]
            });

        }

        const allCommands = this.client.commands
            .map((cmd) => [cmd.name])
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
        }).search(cmd);

        const [match] = result;
        const noMatchEmbed = new this.client.embed()
            .setDescription(
                `No match found for that input. Please try an input closer to one of the command/category names.`
            )
            .setColor("#F00000");

        if (!match) {
            return interaction.createFollowup({
                embeds: [noMatchEmbed],
            });
        }

        const {item} = match;

        console.log(`Item: ` + item)

        if (allCategories.includes(item)) {

            const commandsToPaginate = this.client.commands
                .filter((cmd) => cmd.category.toLowerCase() === item)
                .map(
                    (command) =>
                        `**${this.client.utils.capitalise(command.name)}**\n${
                            command.description
                        }\n`
                );
            const pages = new Paginate(commandsToPaginate, 8).getPaginatedArray();
            const embeds = pages.map((page, index) => {
                return new this.client.embed()
                    .setTitle(`${this.client.utils.capitalise(item)}'s Category Help Menu`)
                    .setDescription(
                        page.join("\n") ??
                        `No more Commands to be listed on page ${index + 1}`
                    )
                    .setTimestamp();
            });

            console.log(embeds);

            if (embeds.length == 1) {
                return interaction.createFollowup({
                    embeds: embeds,
                    components: [{
                        type: 1,
                        components: [{
                            type: 2,
                            style: 5,
                            label: "Website",
                            url: `https://vade-bot.com`,
                        }]
                    }]
                });
            } else if(embeds.length >= 2) {
                return await createPaginationEmbed(interaction, embeds, {});
            }

            const command = this.client.commands.get(cmd);

            if (!command) {
                const cat = categories.find(m => m === cmd.toLowerCase());
                console.log(`cat: ` + cat)

                if (!cat) {
                    return interaction.createFollowup(`That isn't a valid command or category.`);
                } else {
                    const catCommands = this.client.commands.filter(m => m.category.toLowerCase() === cat);
                    const commandsMapped = catCommands.map(c => c.name)
                    // Found a category
                    return interaction.createFollowup(`Located category: ${cmd}`);
                }

            } else {
                // Found a command
                return interaction.createFollowup(`Located cmd: ${command.name}`);
            }

        }

    }

}
