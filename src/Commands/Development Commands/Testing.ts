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

        let options = [
            {
                label: "Test",
                value: "WHOA BIG TEST",
                description: "Testing 123",
                emoji: {
                    name: "vade",
                    id: "858921768672296980"
                }
            },
            {
                label: "Testing 2",
                value: "WHOA BIG TEST 2",
                description: "Testing 1234",
                emoji: {
                    name: "vade",
                    id: "858921768672296980"
                }
            },
            {
                label: "Testing 3",
                value: "WHOA BIG TEST 3",
                description: "Testing 12345",
                emoji: {
                    name: "vade",
                    id: "858921768672296980"
                }
            }
        ];

        let component = this.client.utils.createSelection('testing#selection', 'Choose a selection!', options);

   message.channel.createMessage({
       content: `Testing`,
       components: component
   });

    }

    async runInteraction(interaction, member) {
        interaction.createMessage({ content: `Yo you selected something.... you get these.... ${interaction.data.values.join(", ")}`});

    }

}
