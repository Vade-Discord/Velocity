import Command from "../../Interfaces/Command";

export default class KickCommand extends Command {
    constructor(client) {
        super(client, 'kick', {
            aliases: ["kickmember"],
            description: "boot",
            category: "Moderation",
            modCommand: true,
            userPerms: ['kickMembers']
        });
    }
    async run(message, args) {




     }

    }
