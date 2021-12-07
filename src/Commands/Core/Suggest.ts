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
                },
                {
                    type: 5,
                    name: 'anomynous',
                    description: 'Select true if you would like to send this anomynously.',
                    required: false,
                }
            ],
            ephemeral: true,
        });
    }
    async run(interaction, member, options, subOptions) {

        let anom;
      if(!options.get("anomynous")) {
          await interaction.acknowledge();
      } else {
          anom = true;
      }

        const suggestion = options.get("suggestion");
        const guildData = (await this.client.utils.getGuildSchema(member.guild))!!;
        if(!guildData?.Suggestion) {
            return interaction.createMessage({ content: 'This server does not currently have a suggestion channel setup.', flags: 64 });
        }
        const channel = (await this.client.getRESTChannel(guildData.Suggestion));
        if(!channel) {
            return interaction.createMessage({ content: `This server does not currently have a suggestion channel setup.`, flags: 64 });
        }
        if(channel.type !== 0) {
            return interaction.createMessage({ content: 'The guilds suggestion channel is not set to a text channel. Please get this fixed.', flags: 64 });
        }

        const embed = new this.client.embed()
            .setDescription(`${suggestion}\n\n:bar_chart: Use the reactions below to vote!`)
            .setFooter('Want to suggest something? Use /suggest!')
            .setTimestamp()

        !anom ? embed.setAuthor(`${member.username}#${member.discriminator}`, member.avatarURL) : embed.setAuthor('Anomynous Suggestion', this.client.user.avatarURL)
        const content = guildData?.SuggestionPing ? (member.guild.roles.get(guildData.SuggestionPing) ? member.guild.roles.get(guildData.SuggestionPing).mention : '') : '';
        channel.createMessage({  content, embeds: [embed] }).then(async (e) => {
            await e.addReaction('👍');
            await e.addReaction('👎');
        }).catch(() => {
           return interaction.createMessage({ content: 'Something went wrong when posting your suggestion..', flags: 64 });
        });
        interaction.createMessage({ content: 'Successfully posted that suggestion!', flags: 64 });



    }

    }