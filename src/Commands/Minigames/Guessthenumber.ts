import Command from "../../Interfaces/Command";
import { MessageCollector, TextChannel } from "eris";

export default class GuessthenumberCommand extends Command {
    constructor(client) {
        super(client, 'guess-number', {
            aliases: [""],
            description: "Start a guess the number that lasts 10 minutes!",
            category: "Minigames",
            devOnly: true,
            userPerms: ['manageMessages'],
            options: [
                {
                    type: 7,
                    name: 'channel',
                    description: `The channel to host the event in.`,
                    required: true,
                },
                {
                    type: 4,
                    name: 'number',
                    description: `The number that they have to guess.`,
                    required: true,
                },
            ],
        });
    }
    async run(interaction, member) {

        const channelID = interaction.data.options?.filter(m => m.name === "channel")[0]?.value;
        const channel = await this.client.getRESTChannel(channelID);

        const number: number = interaction.data.options?.filter(m => m.name === "number")[0]?.value;
        console.log(number)
       try {

           if(channel instanceof TextChannel) {
               const embed = new this.client.embed()
                   .setAuthor(`🔢 Guess The Number!`, this.client.user.avatarURL)
                   .setDescription(`${member.mention} has started a guess the number event!\nYou have 5 minutes to guess it!`)
                   .setThumbnail(this.client.user.avatarURL)
                   .setFooter(`Vade Minigames`, this.client.user.avatarURL)
                   .setColor(this.client.constants.colours.turquoise)

               await this.client.redis.set(`minigames.${interaction.guildID}.gtn`, channel.id, 'EX', 600);


              await channel.createMessage({ embed: embed})
               channel.awaitMessages({ timeout: 600000, count: 1, filter: (msg => msg.content == number.toString())}).then((c) => {


               })

           } else {
               return interaction.createFollowup(`Guess the number can only be hosted within a text channel.`);
           }

       } catch (e) {
           console.log(e)
           return interaction.createFollowup(`Something went wrong configuring the game.. please try again later.`);
       }



    }

}
