import Command from "../../Interfaces/Command";
import { Paginate } from "@the-nerd-cave/paginate";
import { createPaginationEmbed } from "../../Classes/Pagination";
import FuzzySearch from 'fuse.js'

export default class HelpCommand extends Command {
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

    async run(interaction, member, options, subOptions) {
        const cmd = options.get("query");
        const allCategories = [
            ...new Set(this.client.commands.map((cmd) => cmd.category.toLowerCase())),
        ];

        const categories = allCategories.filter((_, idx) => allCategories[idx]);
        if (!cmd) {
            //const websiteButton = this.client.utils.createButton(interaction, 'Website', 5, 'https://vade-bot.com', 'help#websiteurl');
            const prefix = "/"
            const mainCommands = this.client.commands.size;
            let subCommands = 0;
            this.client.commands.forEach((command) => {
                subCommands += command.options.filter((option => option.type === 1)).length

            })

            const totalCommands = mainCommands + subCommands;


            const mainEmbed = new this.client.embed().setDescription(
                `**Commands**
                Total: **${totalCommands}** Main: **${mainCommands}** Sub: **${subCommands}**
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

        //console.log(`Item: ` + item)

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
                return await createPaginationEmbed(this.client, interaction, embeds, {});
            }

        } else {
            // It isn't a category
            if(allCommands.includes(item)) {
                const c = allCommands.find(i => i === item);
                if(c) {
                    const com = this.client.commands.get(c);

                    const checkOrCross = (bool) => bool ? this.client.constants.emojis.check.mention : this.client.constants.emojis.x.mention;
                    const cmdEmbed = new this.client.embed()
                    .setTimestamp()
                    .setThumbnail(this.client.user.avatarURL)
                        .setFooter(`Requested by ${member.user.username}#${member.user.discriminator}`)
                    .setDescription(
                      `**❯** Name: **${this.client.utils.capitalise(com.name)}**
                      **❯** Description: **${com.description}**
                        **❯** Category: **${com.category}**
                      **❯** Required Permissions: **${
                      com.userPerms?.length
                          ? com.userPerms.map(this.client.utils.cleanPerms).join(", ")
                          : "No Permissions Needed."
                      }**
                      **❯** Moderator Command: ${checkOrCross(com.modCommand)}
                      **❯** Administrator Command: ${checkOrCross(com.adminCommand)}
                      **❯** [**Premium Command:**](https://vade-bot.com/premium) ${checkOrCross(
                          com.premiumOnly
                      )}
                      `
                    )
                        .addField('**❯** Sub-Commands', `
                    ${com.options.length >= 1 ? 
                        com.options.filter((option => option.type === 1)).map((option) => `Name: **${this.client.utils.capitalise(option.name)}** \n Description: **${option.description}**`).join("\n\n")
                : '**None to be displayed.**'}
                    `);
                    return interaction.createFollowup({
                        embeds: [cmdEmbed],
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
                } else {
                    return interaction.createFollowup(`Unable to locate that command/category.`);
                }
        

            } else {
                return interaction.createFollowup(`Unable to locate that command/category.`);
            }
        }

    }

}
