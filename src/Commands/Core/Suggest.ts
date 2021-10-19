import Command from "../../Interfaces/Command";

export default class SuggestCommand extends Command {
    constructor(client) {
        super(client, 'suggest', {
            description: "Make a suggestion that will get sent to the servers suggestion channel!",
            category: "Core",
            options: [
                {
                    type: 3,
                    name: 'suggestion',
                    description: 'What is your suggestion?',
                    required: true,
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {


        const suggestion = options.get("suggestion");
        const guildData = (await this.client.utils.getGuildSchema(member.guild))!!;
        const logging = guildData?.Suggestion;
        if(!logging) {
            return interaction.createFollowup('This server does not currently have a suggestion channel setup.');
        }


        const channel = (await this.client.getRESTChannel(logging))!!;
        if(channel.type !== 0) {
            return interaction.createFollowup('The guilds suggestion channel is not set to a text channel. Please get this fixed.');
        }

        const embed = new this.client.embed()
            .setAuthor(`${member.username}#${member.discriminator}`, member.avatarURL)
            .setDescription(`${suggestion}\n\n:bar_chart: Use the reactions below to vote!`)
            .setFooter('Want to suggest something? Use /suggest!')
            .setTimestamp()

        channel.createMessage({ embeds: [embed] }).then(async (e) => {
            await e.addReaction('👍');
            await e.addReaction('👎');
        }).catch(() => {
           return interaction.createFollowup('Something went wrong when posting your suggestion..');
        });
        interaction.createFollowup('Successfully posted that suggestion!');



    }

    }