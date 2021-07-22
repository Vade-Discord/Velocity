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

         const streak = await this.client.redis.get(`rpsstreak.${interaction.member.id}`);

         console.log(streak)

        async function handleStreak(client, gameStatus) {
            switch(gameStatus) {
                case "won": {
                if(streak > 0) {
                    await client.redis.set(`rpsstreak.${interaction.member.id}`, parseInt(streak) + 1, 'EX', 86400);
                    return parseInt(streak) + 1;
                } else {
                    await client.redis.set(`rpsstreak.${interaction.member.id}`, 1, 'EX', 86400);
                    return 1;
                    }
                }
                case "loss": {
                    if(streak > 0) {
                        await client.redis.set(`rpsstreak.${interaction.member.id}`, 0, 'EX', 86400);
                        return 0;
                    } else {
                        return 0;
                    }
                }
                default:
                    if(streak > 0) {
                        return streak;
                    } else {
                        return 'No streak.'
                    }
            }
         }

         if (
             (me === "rock" && args[0] === "scissors") ||
             (me === "paper" && args[0] === "rock") ||
             (me === "scissors" && args[0]  === "paper")
         ) {
             embed.setAuthor(`${interaction.member.user.username}, you lost!`, this.client.user.avatarURL)
             embed.setColor('#F00000')
             let streak = await handleStreak(this.client,'loss');
             embed.setFooter(`Streak status: ${streak}`, this.client.user.avatarURL)
             interaction.message.edit({ content: `Game completed!`, components: []});
            return interaction.createMessage({ embeds: [embed] });
         } else if (me === args[0]) {
             embed.setAuthor(`${interaction.member.user.username}, we tied!`, this.client.user.avatarURL)
             embed.setColor('YELLOW')

             let streak = await handleStreak(this.client, 'tie');
             embed.setFooter(`Streak status: ${streak}`, this.client.user.avatarURL)
             interaction.message.edit({ content: `Game completed!`, components: []});
             return interaction.createMessage({ embeds: [embed] });
         } else {
             embed.setAuthor(`${interaction.member.user.username}, you won!`, this.client.user.avatarURL)
             embed.setColor(this.client.constants.colours.green)
             let streak = await handleStreak(this.client, 'won');
             embed.setFooter(`Streak status: ${streak}`, this.client.user.avatarURL)
             interaction.message.edit({ content: `Game completed!`, components: []});
             return interaction.createMessage({ embeds: [embed] });
         }



     }

    }
