import Command from "../../Interfaces/Command";

export default class TrustCommand extends Command {
    constructor(client) {
        super(client, 'checktrust', {
            description: "Check the trust of another individual!",
            category: "Information",
        });
    }
    async run(message, args) {


        }
    }