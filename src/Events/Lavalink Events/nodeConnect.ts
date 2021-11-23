import { Event } from '../../Interfaces/Event';


export default class NodeConnectEvent extends Event {
    constructor(client) {
        super(client, "nodeConnect", {
            emitter: "manager",
        });
    }

    async run(node) {
        this.client.logger.info(`Node "${node.options.identifier}" connected.`);
    }

}