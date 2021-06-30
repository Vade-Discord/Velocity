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

   let button = this.client.utils.createButton(message, 'Testing aha', 1, null, 'testing#1');
   message.channel.createMessage({ content: 'Here you go!', components: button });

    }

    async runInteraction(interaction, member) {
        interaction.createMessage({ content: `This button was clicked!`});

    }

}
