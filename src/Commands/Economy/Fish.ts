import Command from "../../Interfaces/Command";
import ms from 'ms';

export default class FishCommand extends Command {
    constructor(client) {
        super(client, 'fish', {
            description: "Go fishing and test your luck!",
            category: "Economy",
        });
    }
    async run(interaction, member, options, subOptions) {

        const cooldown = (await this.client.redis.get(`fishing.cooldown.${member.id}`));
        if(cooldown) {
            return interaction.createFollowup(`You are currntly in a cooldown! **${ms(
                cooldown - Date.now(),
                { long: true }
            )}** remaining!`)
        } else {
            await this.client.redis.set(`fishing.cooldown.${member.id}`, Date.now() + ms('40s'), 'EX', 40);
        }
        const profile = (await this.client.utils.getProfileSchema(member.id))!!;
        if(!("Inventory" in profile) || profile.Inventory.filter((i) => i.name === 'rod')?.length < 1) {
            return interaction.createFollowup('You do not currently own a fishing rod! Purchase one from the shop!');
        }

        const fishAmount = [1, 3, 5, 7];
        // generate a random number between 0 and 100.
        const randomNumber = Math.floor(Math.random() * 200);
        // create a switch statement with 5 cases. The first case should be for a fish that is less than 10% likely to be caught.
        // The second case should be for a fish that is less than 30% likely to be caught.
        // The third case should be for a fish that is less than 50% likely to be caught.
        // The fourth case should be for a fish that is less than 70% likely to be caught.
        // The fifth case should be for a fish that is less than 90% likely to be caught.
        switch (true) {
            case (randomNumber < 10): {
                interaction.createFollowup('You caught a **tiny** fish!');
               await this.client.utils.changeInventoryItem(profile, 'fish', 1);
                break;
            }
            case (randomNumber < 30): {
                interaction.createFollowup('You caught **3** fish!');
              await this.client.utils.changeInventoryItem(profile, 'fish', 3);
                break;
            }
            case (randomNumber < 50): {
                interaction.createFollowup('You caught a goldfish!');
                await this.client.utils.changeInventoryItem(profile, 'goldfish', 1);
                break;
            }
            case (randomNumber < 70): {
                interaction.createFollowup('You managed to catch a whale!');
              await this.client.utils.changeInventoryItem(profile, 'whale', 1)
                break;
            }
            case (randomNumber < 90): {
                interaction.createFollowup('You caught a **giant** shark!');
                this.client.utils.changeInventoryItem(profile, 'shark', 1)
                break;
            }
            case (randomNumber < 100): {
                interaction.createFollowup('You latched onto something, pulled and then your rod snatched in half!');
              await this.client.utils.changeInventoryItem(profile, 'rod', 1, true);

                break;
            }
            case(randomNumber > 195): {
                interaction.createFollowup('You managed to find a dufflebag containing around **$10,000** in cash! The money has been added to your Wallet!');
               await this.client.utils.changeCash(profile, 10000);
                break;
            }

            default: {
                 interaction.createFollowup('You tried your hardest but were unable catch anything!')
                break;
            }
        }








    }

    }