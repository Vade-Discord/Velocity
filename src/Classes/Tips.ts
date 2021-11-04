import { tips } from '../Assets/Tips.json';
import { Bot } from "../Client/Client";
// export a default function named generateTip

export default async function generateTip(client: Bot, interaction) {

    // generate a random number between 0 and 100
    const tipPercentage = Math.floor(Math.random() * 100);
    // get a random tip from the tips array
    const tip = tips[Math.floor(Math.random() * tips.length)];
    // if tip percentage is higher than 90 do x
    if (tipPercentage > 90) {

        const embed = new client.embed()
            .setAuthor('Random tip!', client.user.avatarURL)
            .setDescription(tip)
            .setFooter(`Velocity | Tip System`)
            .setTimestamp()
            .setColor(client.constants.colours.green);
       await interaction.createMessage({ embeds: [embed], flags: 64});
        return true;


    } else {
        return false;
    }

}