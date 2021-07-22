import { Event } from '../../Interfaces/Event';
import { Interaction } from 'eris';

      export default class interactionCreateEvent extends Event {
          constructor(client) {
              super(client, "interactionCreate", {

              });
          }

          async run(interaction: Interaction) {

             // await interaction.acknowledge();
              if(!interaction.data) return;

              const com = interaction.data.custom_id.split("#")[0];
              const args = interaction.data.custom_id.split("#").splice(1);

              if(com == 'pagination') {
                  const pages = await this.client.Pagination.get(interaction.message.id)
                  // @ts-ignore
                  pages.run(interaction)
              }
              const { member } = interaction;
              const split = interaction.data.custom_id;
              const cmd = split.split("#")[0];
              const id = split.split("#")[2];
              const extra = split.split("#").length >= 3 ? split.split("#")[3] : null;
              // @ts-ignore
              switch(interaction.data.component_type) {
                  case 3: {
                      console.log(`Selection menu`);
                      const command = this.client.commands.get(cmd);
                      if(!command || !command.runInteraction) return;
                      await command.runInteraction(interaction, args, id, extra);
                      break;
                  }
                  case 2: {
                      const command = this.client.commands.get(cmd);
                      if(!command || !command.runInteraction) return;
                      await command.runInteraction(interaction, args, id, extra);
                      break;
                  }
                  default:
                      return console.log(`Unknown interaction type.`);
              }

          };

      }