import Command from "../../Interfaces/Command";

export default class InviteCommand extends Command {
    constructor(client) {
        super(client, 'invite', {
            aliases: [""],
            description: "Invite the Bot!",
            category: "Utility",
        });
    }
    async run(message, args) {



    }

}
