import Command from "../../Interfaces/Command";

export default class DehoistCommand extends Command {
    constructor(client) {
        super(client, 'dehoist', {
            description: "Remove special characters from members usernames. Such as: !, @ etc.",
            category: "Moderation",
            userPerms: ['manageNicknames'],
            botPerms: ['manageNicknames'],
            guildOnly: true,
        });
    }
    async run(interaction, member) {

        const guild = await this.client.getRESTGuild(interaction.guildID);
        if(!guild) {
            return interaction.createFollowup(`Looks like there was an error when fetching your guilds members. Please try again later.`);
        }
        const guildMembers = (await guild.getRESTMembers({
            limit: 1000
        }));

        const characters = ['!', '@', '#', '~', '?', ';', '£', '$', '%', '^', '&', '*'];
        const filter = guildMembers.filter(u => u.nick && characters.some((char) => u.nick?.trim().startsWith(char)) || u.username && u.nick !== "No Hoisting" && characters.some((char) => u.username?.trim().startsWith(char)));
        try {
            if(filter.length) {
                filter.forEach((memb) => {
                    memb.edit({
                        nick: `No Hoisting`
                    });
                });
                return interaction.createFollowup(`Successfully dehoisted **${filter.length}** members usernames.`);
            } else {
                return interaction.createFollowup(`No members need dehoisting.`);
            }
        } catch (e) {
            return interaction.createFollowup(`Looks like there was an error when attempting to change the member(s) nicknames. Please try again later.`);
        }


    }

}
