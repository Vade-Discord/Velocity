import { Event } from '../../Interfaces/Event';
import { createPaginationEmbed } from '../../Classes/Pagination';
import { Interaction } from 'eris';

      export default class interactionCreateEvent extends Event {
          constructor(client) {
              super(client, "interactionCreate", {

              });
          }

          async run(interaction: Interaction) {

              if(!interaction.data) return;
              const { member } = interaction;
              const split = interaction.data.custom_id;
              const cmd = split.split("#")[0];
              const id = split.split("#")[2];
              const extra = split.split("#").length >= 3 ? split.split("#")[3] : null;
              if(cmd === 'paginate') return;
              // @ts-ignore
              switch(interaction.data.component_type) {
                  case 3: {
                  console.log(`Selection menu`);
                      const command = this.client.commands.get(cmd);
                      if(!command || !command.runInteraction) return;
                      await command.runInteraction(interaction, member, id, extra);
                      break;
                  }
                  case 2: {
                      const command = this.client.commands.get(cmd);
                      if(!command || !command.runInteraction) return;
                      await command.runInteraction(interaction, member, id, extra);
                      break;
                  }
                  default:
                      return console.log(`Unknown interaction type.`);
              }


          }

      }