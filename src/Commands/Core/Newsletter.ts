import Command from "../../Interfaces/Command";

export default class NameCommand extends Command {
    constructor(client) {
        super(client, 'newsletter', {
            description: "Subscribe to Velocity's newsletter and receive important news and updates!",
            category: "Core",
        });
    }
    async run(interaction, member) {

        const profile = (await this.client.utils.getProfileSchema(member.id))!!;
        if(profile?.Newsletter) {
            await profile.updateOne({
                Newsletter: false,
            });
            return interaction.createFollowup(`Successfully removed your newsletter subscription.`);
        } else {
            await profile.updateOne({
                Newsletter: true,
            });
            return interaction.createFollowup(`Successfully added your newsletter subscription. This can be removed at any time via \`/newsletter\`.`);
        }


    }

}
