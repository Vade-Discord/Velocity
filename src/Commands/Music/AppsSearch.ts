import Command from "../../Interfaces/Command";

export default class CommandName extends Command {
    constructor(client) {
        super(client, 'add to queue', {
            description: "Search for a song with the message's content!",
            category: "Music",
            contextUserMenu: true,
            contextOnly: true,
            contextType: 3,
        });
    }
    async run(interaction, member, options, subOptions) {

       const messages = (await this.client.getMessages(interaction.channel.id));
       console.log(messages)
       const msg = (messages.filter((msg) => msg.id === interaction.data.target_id))[0];
       if(!msg || !msg?.content) {
           return interaction.createFollowup('Somethig went wrong when checking the message content, please try again later.');
       }
       console.log(msg)
       const playCommand = this.client.commands.get('play');
       const o = new Map();
       o.set("input", msg.content);
       playCommand.run(interaction, member, o, subOptions);


    }

    }