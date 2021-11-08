import Command from "../../Interfaces/Command";

export default class DehoistCommand extends Command {
    constructor(client) {
        super(client, 'dehoist', {
            description: "Remove special characters from members usernames. Such as: !, @ etc.",
            category: "Moderation",
            userPerms: ['manageNicknames'],
            botPerms: ['manageNicknames'],
            premiumOnly: true,
            guildOnly: true,
        });
    }
    async run(interaction, member) {

        const guild = await this.client.getRESTGuild(interaction.guildID);
        if(!guild) {
            return interaction.createFollowup(`Looks like there was an error when fetching your guilds members. Please try again later.`);
        }
        ((await guild.fetchAllMembers()));
        const guildMembers = guild.members;
            // create a regex that checks for special characters at the beginning of a string
            const regex = /^[^a-zA-Z0-9_]+/;
        const characters = ['!', '@', '#', '~', '?', ';', '£', '$', '%', '^', '&', '*', '=', ';', ':', '>', '<'];
        const filter = guildMembers.filter(u => u.nick && regex.test(u.nick) || u.username && u.nick !== "No Hoisting" && regex.test(u.username));
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
