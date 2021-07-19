import { Event } from '../../Interfaces/Event';
import { Interaction } from 'eris';

      export default class interactionCreateEvent extends Event {
          constructor(client) {
              super(client, "interactionCreate", {

              });
          }

          async run(interaction: Interaction) {

              await interaction.acknowledge();
              if(!interaction.data) return;

              const cmd = interaction.data.custom_id.split("#")[0];

              if(cmd == 'pagination') {
                  const pages = await this.client.Pagination.get(interaction.message.id)
                  // @ts-ignore
                  pages.run(interaction)
              }

          };

      }