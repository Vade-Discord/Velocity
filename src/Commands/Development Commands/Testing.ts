import Command from "../../Interfaces/Command";

export default class TestingCommand extends Command {
    constructor(client) {
        super(client, 'testing', {
            aliases: ["test"],
            description: "Currently testing - levenshtein",
            category: "Development",
        });
    }
    async run(message, args) {

    const channel = await this.client.utils.getChannel(args[0], message.channel.guild);
    if(!channel) return message.channel.createMessage({ content: `No channel was located.`, messageReference: { messageID: message.id }});
        message.channel.createMessage({ content: `Located channel: ${channel.name}`, messageReference: { messageID: message.id }});
     }

    }
