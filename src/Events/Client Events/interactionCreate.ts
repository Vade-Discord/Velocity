  import { Event } from '../../Interfaces/Event';

      export default class interactionCreateEvent extends Event {
          constructor(client) {
              super(client, "interactionCreate", {

              });
          }

          async run(interaction) {

              const { member } = interaction;
              if(!interaction.data) return;
              const split = interaction.data.custom_id;
              const cmd = split.split("#")[0];
              const command = this.client.commands.get(cmd);
              console.log(cmd)
              if(command) {
                  command.runInteraction(interaction, member);
              }
          }

      }