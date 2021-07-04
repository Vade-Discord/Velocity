  import { Event } from '../../Interfaces/Event';

      export default class VoiceUpdateEvent extends Event {
          constructor(client) {
              super(client, "voiceStateUpdate", {

              });
          }

          async run(member, oldState, newState) {


          }

      }