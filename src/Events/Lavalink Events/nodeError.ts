import { Event } from '../../Interfaces/Event';


export default class NodeErrorEvent extends Event {
    constructor(client) {
        super(client, "nodeError", {
         emitter: "manager",
        });
    }

    async run(node, error) {
        this.client.logger.error(
            `Node "${node.options.identifier}" encountered an error: ${error.message}.`
        );

    }

}