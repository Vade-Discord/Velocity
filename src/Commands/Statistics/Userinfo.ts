import Command from "../../Interfaces/Command";
import {Constants} from "eris";

export default class UserinfoCommand extends Command {
    constructor(client) {
        super(client, 'userinfo', {
            aliases: [""],
            description: "Get information on a user!",
            category: "Statistics",
            guildOnly: true,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: `The user you would like to see the information of.`,
                    required: true,
                },
            ],
        });
    }
    async run(interaction, member) {

        if(!interaction.data.resolved.users) await interaction.data.users.resolve();
        const u = interaction.data.options?.filter(m => m.name === "user")[0].value;

        if(!u) {
            return interaction.createFollowup(`You need to provide a user.`);
        }

        const user = await this.client.getRESTUser(u);

        const e = Object.entries(Constants.UserFlags).map(([f, v]) => (user.publicFlags & v) !== 0 ? f : null).filter(Boolean)

        console.log(e);








    }

}
