import Command from "../../Interfaces/Command";

export default class KissCommand extends Command {
    constructor(client) {
        super(client, 'kiss', {
            aliases: ["smooch"],
            description: "Give someone a kiss!",
            category: "Fun",
        });
    }
    async run(message, args) {


        try {
            const data = await fetch("https://nekos.life/api/kiss").then((res) => res.json());
            const member = await this.client.utils.getMember(message, args[0]);
            if(!member) return;
            const user = member?.user;
            const kissed = message.author.id === user.id ? "themselves" : user.username;

            const embed = new this.client.embed()
                .setTitle(`${message.author.username} kissed ${kissed}`)
                .setDescription(`[Click to view](${data.url})`)
                .setImage(`${data.url}`);

            return message.channel.send(embed);
        } catch (err) {
            console.log(err)
            return message.channel.createMessage({content: `An unknown error has occured.`, messageReference: { messageID: message.id }});
        }

     }

    }
