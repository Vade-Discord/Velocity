import Command from "../../Interfaces/Command";
const chanceNeeded = 65;

export default class HeadsOrTailsCommand extends Command {
    constructor(client) {
        super(client, 'heads-tails', {
            description: "Play a simple game of heads or tails!",
            category: "Minigames",
        });
    }
    async run(interaction, member) {

        const userProfile = (await this.client.utils.getProfileSchema(member.id))!!;
        const cooldownCheck = await this.client.redis.get(`cooldowns.heads-tails.${member.id}`);
        if(cooldownCheck) {
            return interaction.createFollowup(`You currently have an active cooldown.`);
        }

        if(interaction.data.custom_id) {
            // Clicked head or tails button
            const choice = interaction.data.custom_id.split("#")[1];

            const availableChoices = ['heads', 'tails'];
            const myChoice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
            const chance = Math.floor(Math.random() * 100);
            if(choice === 'cancel') {
                 interaction.createFollowup({ content: 'Successfully cancelled.' });
                 interaction.editOriginalMessage({ content: 'This game was cancelled.', components: [] });

                 return;
            }

            switch(myChoice) {
                case "heads": {
                    if(choice === 'tails') {
                        interaction.createFollowup({ content: 'You lost! It landed on heads!' });
                    } else {
                        interaction.createFollowup({ content: `Correct! It landed on heads! ${chance > chanceNeeded ? 'Take $500 as a reward!' : ''}` });
                        if(chance > chanceNeeded) {
                            await userProfile.updateOne({
                                $inc: { Wallet: 500 }
                            });
                        }
                    }

                    break;
                }

                case "tails": {
                    if(choice === 'heads') {
                        interaction.createFollowup({ content: 'You lost! It landed on tails!' });
                    } else {
                        interaction.createFollowup({ content: `Correct! It landed on tails! ${chance > chanceNeeded ? 'Take $500 as a reward!' : ''}` });
                        if(chance > chanceNeeded) {
                            await userProfile.updateOne({
                                $inc: { Wallet: 500 }
                            });
                        }
                    }

                    break;
                }
            }
            await this.client.redis.set(`cooldowns.heads-tails.${member.id}`, true, 'EX', 15);
            interaction.editOriginalMessage({ content: 'This game has ended.', components: [] });

            return;
        }

        interaction.createFollowup({ content: 'Please choose either heads or tails!',  components: [{
                type: 1,
                components: [
                    {
                    type: 2,
                    style: 1,
                    label: "Heads",
                        custom_id: 'heads-tails#heads'
                   },
                    {
                        type: 2,
                        style: 3,
                        label: "Tails",
                        custom_id: 'heads-tails#tails'
                    },
                    {
                        type: 2,
                        style: 4,
                        label: "Cancel",
                        emoji: { id: this.client.constants.emojis.trash.id, name: this.client.constants.emojis.trash.name, animated: false },
                        custom_id: 'heads-tails#cancel'
                    }
                ]
            }]})


    }

}
