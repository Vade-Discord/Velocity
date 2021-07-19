import Command from "../../Interfaces/Command";
import guildWarnings from '../../Schemas/Main Guilds/GuildWarnings';
import { Paginate } from "@the-nerd-cave/paginate";
import { createPaginationEmbed } from "../../Classes/Pagination";

export default class WarningsCommand extends Command {
    constructor(client) {
        super(client, 'warnings', {
            aliases: ["viewwarns"],
            description: "View the warnings of another member.",
            category: "Moderation",
            guildOnly: true,
        });
    }
    async run(message, args) {

        try {

            let member = await this.client.utils.getMember(message, args[0]);
            if (!member) member = message.member;
            const locateWarnings = await guildWarnings.findOne({ user: member.id, guild: message.channel.guild.id });
            if (!locateWarnings) {
                return message.channel.createMessage({
                    content: `${message.member.id === member.id ? 'You' : 'They'} have no warnings.`,
                    messageReference: {messageID: message.id}
                });
            }
            const stuffToPaginate = locateWarnings.reasons.map((m, i) => {
               return `**#${i + 1}** - "${m}"`
            });

            const websiteButton = this.client.utils.createButton(message, 'Website', 5, 'https://vade-bot.com', 'help#websiteurl');
            const pagination = new Paginate(stuffToPaginate, 8).getPaginatedArray();
            const embeds = await pagination.map((page, index) => {
                return new this.client.embed()
                    .setTitle(`${member.username}#${member.discriminator}'s Warnings`)
                    .setDescription(
                        page.join("\n\n") ??
                        `No more warnings to be listed on page ${index + 1}`
                    )
                    .setTimestamp();
            });

            if (embeds?.length <= 1) {
                return message.channel.createMessage({embed: embeds[0], components: websiteButton});
            }
            return await createPaginationEmbed(message, embeds, {})

        } catch (e) {
            console.log(e)
        }


     }

    }
