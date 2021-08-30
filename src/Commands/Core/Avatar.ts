import Command from "../../Interfaces/Command";

export default class AvatarCommand extends Command {
    constructor(client) {
        super(client, 'avatar', {
            aliases: [""],
            description: "Check out a users avatar!",
            category: "Core",
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: `The person who's avatar you would like to see.`,
                    required: true,
                }
            ],
            contextUserMenu: true,
        });
    }
    async run(interaction, member, options) {
        const u = options.get("user") ?? interaction.data?.target_id;
        const user = await this.client.getRESTUser(u);
        if(user) {
            const avatar = user.dynamicAvatarURL(null, 512);
            const embed = new this.client.embed()
                .setAuthor(`${user.username}#${user.discriminator}'s Avatar`, this.client.user.avatarURL)
                .setImage(avatar)
                .setTimestamp()
                .setFooter(`Vade Utilities`, this.client.user.avatarURL)

            return interaction.createFollowup({ embeds: [embed]});
        } else {
            return interaction.createFollowup(`Oops! Looks like you didn't provide a user!`);
        }

    }

}
