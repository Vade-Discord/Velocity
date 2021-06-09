import Command from "../../Interfaces/Command";
import hastebin from 'hastebin-gen'

export default class DiscriminatorCommand extends Command {
    constructor(client) {
        super(client, 'discriminator', {
            aliases: ["discrim", "tag"],
            description: "",
            category: "Fun",
            args: true,
        });
    }
    async run(message, args) {

        try {
            const discrim = args[0];
            if (isNaN(parseInt(discrim))) return message.channel.createMessage({
                content: `You need to provide a discriminator to search for!`,
                messageReference: {messageID: message.id}
            });
            const users = this.client.users.filter(m => m.discriminator === discrim)?.map(m => m.username + `#${m.discriminator}`)
            if (!users.length) return message.channel.createMessage({
                content: `Couldn't locate anyone with that tag.`,
                messageReference: {messageID: message.id}
            });
            hastebin(users.join("\n"))
                .then((haste) => {
                    message.channel.createMessage(
                        `${users.length} Users found with the Discriminator: **#${discrim}**! \n${haste}`
                    );
                })

        } catch (e) {
            console.log(e)
            return message.channel.createMessage({
                content: `An unknown error has occured!`,
                messageReference: {messageID: message.id}
            });
        }



     }

    }
