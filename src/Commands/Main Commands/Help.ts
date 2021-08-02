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
           //const websiteButton = this.client.utils.createButton(interaction, 'Website', 5, 'https://vade-bot.com', 'help#websiteurl');
           let prefix = "/"
           const totalCommands = this.client.commands.size;

           const allCategories = [
               ...new Set(this.client.commands.map((cmd) => cmd.category)),
           ];

           const categories = allCategories.filter((_, idx) => allCategories[idx]);

               const mainEmbed = new this.client.embed().setDescription(
                   //`Prefix: ** ${prefix} **\n
                    `Total Commands: **${totalCommands}**\n
                    [Support Server](https://discord.gg/FwBUBzBkYt)  **|** [Website](https://vade-bot.com) **|**  [Dashboard](https://vade-bot.com/dashboard)`
               );
               for (const category of categories) {
                   mainEmbed.addField(
                       `**${this.client.utils.capitalise(category)} [${this.client.commands.filter((cmd) => cmd.category === category).size
                       }]**`,
                       `${prefix}help ${this.client.utils.capitalise(category)}`,
                       true
                   );
               }
           return interaction.createFollowup({
                   embeds: [mainEmbed],
                   components: [{
                       type: 1,
                       components: [{
                           type: 2,
                           style: 5,
                           label: "Website",
                           url: `https://vade-bot.com`,
                       }]
                   }]
               });
           
       }
       const command = this.client.commands.get(cmd);

        if(!command) {
            const cat = this.client.commands.filter(m => m.category.toLowerCase() === cmd.toLowerCase());
            console.log(cat)
            if(!cat[0]) {
                return interaction.createFollowup(`That isn't a valid command or category.`);
            } else {
                return interaction.createFollowup(`Loctaed category: ${cmd}`);
            }

        } else {
            return interaction.createFollowup(`Located cmd: ${command.name}`);
        }

    }

}
