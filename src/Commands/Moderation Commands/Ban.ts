import Command from "../../Interfaces/Command";

export default class BanCommand extends Command {
    constructor(client) {
        super(client, 'ban', {
            aliases: ["addban", 'guildban'],
            description: "Ban a member from the server.",
            category: "Moderation",
        });
    }
    async run(message, args) {



     }

    }
