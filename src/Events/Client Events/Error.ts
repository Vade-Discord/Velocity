  import { Event } from '../../Interfaces/Event';

      export default class EventName extends Event {
          constructor(client) {
              super(client, "error", {

              });
          }

          async run(error) {
            this.client.logger.error(error);
          }

      }