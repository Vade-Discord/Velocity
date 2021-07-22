import Command from "../../Interfaces/Command";

export default class MuteCommand extends Command {
    constructor(client) {
        super(client, 'mute', {
            aliases: ["silence"],
            description: "Mute a member within the current server.",
            category: "Moderation",
            modCommand: true,
            userPerms: ['manageMessages'],
            botPerms: ['manageRoles']
        });
    }
    async run(message, args) {



     }

    }