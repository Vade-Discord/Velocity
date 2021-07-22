import Command from "../../Interfaces/Command";
import phin from 'phin';
import { stripIndents } from 'common-tags';

let a;

export default class WouldyouratherCommand extends Command {
    constructor(client) {
        super(client, 'wouldyourather', {
            aliases: ["wyr"],
            description: "Play a fun little game of would you rather!",
            category: "Fun",
        });
    }
    async run(message, args) {



        try {
            const data = await fetchScenario();
            a = data;
            const Buttons = [{
                "type": 1,
                "components": [{
                    "type": 2,
                    "label": '1',
                    "style": 1,
                    "custom_id": `wouldyourather#1#${message.author.id}`,
                },
                    {
                        "type": 2,
                        "label": '2',
                        "style": 1,
                        "custom_id": `wouldyourather#2#${message.author.id}`,
                    }]
            }]

            await message.channel.createMessage({content: stripIndents`
				${data.prefix ? `${data.prefix}, would you rather...` : "Would you rather..."}
				**1.** ${data.option_1}
				**2.** ${data.option_2}
				_Select either 1 or 2 to continue._
			`, messageReference: { messageID: message.id}, components: Buttons});


        } catch (e) {
            console.log(e)
            return message.channel.createMessage({ content: `Something went wrong... please try again.`, messageReference: { messageID: message.id }});
        }



     }

     async runInteraction(interaction, args, id, extra) {
        const type = interaction.data.custom_id.split("#")[1];
        const data = a;
        if(!interaction.member) {
            interaction.member = interaction.user;
        }
        if(interaction.member.id !== id) {
            return;
        }
         const totalVotes =
             Number.parseInt(data.option1_total, 10) +
             Number.parseInt(data.option2_total, 10);
         const numToUse = type
             ? Number.parseInt(data.option1_total, 10)
             : Number.parseInt(data.option2_total, 10);
          interaction.createMessage({content: stripIndents`
				**${Math.round((numToUse / totalVotes) * 100)}%** of people agree!
				${this.client.utils.formatNumber(data.option1_total)} - ${this.client.utils.formatNumber(data.option2_total)}
			`});
         await interaction.message.edit({ content: `Completed!`, components: []});

     }

    }


async function fetchScenario() {
    const {body} = await phin({url: "http://either.io/", parse: "string"});
    return JSON
        .parse(body.match(/window.initial_question = (\{.+\})/)[1])
        .question;
}

async function postResponse(id, bool) {
    try {
        const {body} = await phin({
            url: `http://either.io/vote/${id}/${bool ? "1" : "2"}`,
            headers: {"X-Requested-With": "XMLHttpRequest"},
            parse: "string"
        })

        return JSON.parse(body).result;
    } catch {
        return false;
    }
}