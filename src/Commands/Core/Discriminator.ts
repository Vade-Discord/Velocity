import Command from "../../Interfaces/Command";
import hastebin from "hastebin-gen"

export default class DiscriminatorCommand extends Command {
    constructor(client) {
        super(client, 'discriminator', {
            description: "Lookup a discriminator.",
            category: "Core",
            options: [
                {
                    type: 3,
                    name: 'query',
                    description: 'The discriminator to search for.',
                    required: true,
                }
            ]
        });
    }
    async run(interaction, member, options) {

        const query = options.get("query");
        if(query?.length > 4) {
            return interaction.createFollowup(`A discriminator shouldn't be more than 4 characters.`);
        }

        const users = this.client.users.filter(u => u.discriminator == query).map((u) => `${u.username}#${u.discriminator}`);
        if(!users?.length) {
            return interaction.createFollowup(`Unable to locate anybody with that discriminator.`);
        }

        hastebin(users.join("\n")).then((haste) => {
            interaction.createFollowup(`Users found with the discriminator **#${query}**: ${haste}`);
        }).catch(() => {
            return interaction.createFollowup(`Something went wrong, please try again later.`);
        })



    }

}
