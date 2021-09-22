import Command from "../../Interfaces/Command";

export default class FactionCommand extends Command {
    constructor(client) {
        super(client, 'faction', {
            description: "Create, manage and invite others to your faction!",
            category: "Core",
        });
    }
    async run(interaction, member) {


    }

}
