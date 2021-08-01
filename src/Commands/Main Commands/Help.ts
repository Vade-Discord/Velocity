import Command from "../../Interfaces/Command";

export default class PingCommand extends Command {
    constructor(client) {
        super(client, 'help', {
            aliases: [""],
            description: "Get help with the bot!",
            category: "Main",
            options: [
                {
                type: 3,
                name: 'command',
                description: `Name of the command that you would like help with.`,
                required: false,
            },
                {
                    type: 3,
                    name: 'category',
                    description: `Name of the category that you would like help with.`,
                    required: false,
                }]
        });
    }
    async run(interaction, member) {

       const cmd = interaction.data.options?.filter(m => m.name === "command")[0] ?
           interaction.data.options.filter(m => m.name === "command")[0].value :
           interaction.data.options?.filter(m => m.name === "category")[0].value;
       if(!cmd) {
           return interaction.createFollowup(`You need to provide either a command or category.`);
       }
       const command = this.client.commands.get(cmd);

        if(!command) {
            const cat = this.client.commands.filter(m => m.category.toLowerCase() === cmd.toLowerCase());
            if(!cat) {
                return interaction.createFollowup(`That isn't a valid command or category.`);
            } else {
                return interaction.createFollowup(`Loctaed category: ${cmd}`);
            }

        } else {
            return interaction.createFollowup(`Located cmd: ${command.name}`);
        }


    }

}
