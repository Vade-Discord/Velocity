import Command from "../../Interfaces/Command";

export default class RpsCommand extends Command {
    constructor(client) {
        super(client, 'rockpaperscissors', {
            aliases: ["rps"],
            description: "A simple game of rock paper scissors.",
            category: "Fun",
        });
    }
    async run(message, args) {

        const Buttons = [{
            "type": 1,
            "components": [{
                "type": 2,
                "emoji": { id: null, name: `🧻`},
                "style": 1,
                "custom_id": `rockpaperscissors#rock#${message.author.id}`,
            },
                {
                    "type": 2,
                    "emoji": { id: null, name: `✂`},
                    "style": 1,
                    "custom_id": `rockpaperscissors#paper#${message.author.id}`,
                },
                {
                    "type": 2,
                    "emoji": { id: null, name: `🪨`},
                    "style": 1,
                    "custom_id": `rockpaperscissors#scissors#${message.author.id}`,
                }]
        }]

        message.channel.createMessage({ content: `Welcome to rock paper scissors! Make your selection below!`, components: Buttons, messageReference: { messageID: message.id }})


     }

     async runInteraction(interaction, args, id) {
        if(interaction.member.id !== id) {
            return;
        }

         const choices = ["rock", "scissors", "paper"];
         const me = choices[Math.floor(Math.random() * choices.length)];
         const embed = new this.client.embed()
             .setTimestamp()



         if (
             (me === "rock" && args[0] === "scissors") ||
             (me === "paper" && args[0] === "rock") ||
             (me === "scissors" && args[0]  === "paper")
         ) {
             embed.setAuthor(`${interaction.member.user.username}, you lost!`, this.client.user.avatarURL)
             embed.setColor('#F00000')
             let streak = await this.client.utils.handleStreak(this.client, 'rpsstreak', interaction,'loss');
             embed.setFooter(`Streak status: ${streak}`, this.client.user.avatarURL)
             interaction.message.edit({ content: `Game completed!`, components: []});
            return interaction.createMessage({ embeds: [embed] });
         } else if (me === args[0]) {
             embed.setAuthor(`${interaction.member.user.username}, we tied!`, this.client.user.avatarURL)
             embed.setColor('YELLOW')

             let streak = await this.client.utils.handleStreak(this.client, 'rpsstreak', interaction,'tie');
             embed.setFooter(`Streak status: ${streak}`, this.client.user.avatarURL)
             interaction.message.edit({ content: `Game completed!`, components: []});
             return interaction.createMessage({ embeds: [embed] });
         } else {
             embed.setAuthor(`${interaction.member.user.username}, you won!`, this.client.user.avatarURL)
             embed.setColor(this.client.constants.colours.green)
             let streak = await this.client.utils.handleStreak(this.client, 'rpsstreak', interaction, 'won');
             embed.setFooter(`Streak status: ${streak}`, this.client.user.avatarURL)
             interaction.message.edit({ content: `Game completed!`, components: []});
             return interaction.createMessage({ embeds: [embed] });
         }



     }

    }
