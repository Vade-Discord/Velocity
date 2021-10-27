import Command from "../../Interfaces/Command";

export default class InviteCommand extends Command {
    constructor(client) {
        super(client, 'invite', {
            description: "Invite the bot!",
            category: "Core",
        });
    }
    async run(interaction, member, options, subOptions) {

        const embed = new this.client.embed()
            .setAuthor(`Invite the bot below!`, this.client.user.avatarURL)
            .setDescription(`[Click here!](https://discord.com/api/oauth2/authorize?client_id=850723996513075200&permissions=8&scope=bot%20applications.commands)`)
            .setColor(this.client.constants.colours.green)
            .setTimestamp()

        interaction.createFollowup({ embeds: [embed] });

    }

    }