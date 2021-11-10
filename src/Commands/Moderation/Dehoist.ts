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
        await guild.fetchAllMembers(10000);
            // create a regex that checks for special characters at the beginning of a string
            const regex = /^[^a-zA-Z0-9_]+/;
        const count = [];
        try {
            await member.guild.members.forEach(async (member) => {
                if(member?.nick && regex.test(member.nick) || member.username && !member?.nick && member.username.match(regex)) {
                    count.push(member.id)
                   await member.edit({ nick: 'No Hoisting' });
                }
            });

            interaction.createFollowup(count?.length ? `Successfully dehoisted **${count.length}** members username${count.length === 1 ? '' : 's'}.` : `No members usernames were dehoisted.`);
        } catch (e) {
            return interaction.createFollowup(`Looks like there was an error when attempting to change the member(s) nicknames. Please try again later.`);
        }


    }

}
