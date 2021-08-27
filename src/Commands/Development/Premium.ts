import Command from "../../Interfaces/Command";
import guildSchema from "../../Schemas/Main Guilds/GuildSchema";

export default class PremiumCommand extends Command {
    constructor(client) {
        super(client, 'premium', {
            description: "Add premium to a server.",
            category: "Development",
        });
    }
    async run(interaction, member, options, subOptions) {


        const schema = await guildSchema.findOne({ guildID: interaction.guildID });
        if(schema) {
            await schema.updateOne({
                Premium: {
                    active: true,
                },
            });
            return interaction.createFollowup(`Successfully added the premium!`);
        } else {
            return interaction.createFollowup(`This guild doesn't have any data.`);
        }
    }

}
