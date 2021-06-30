 import { Event } from '../../Interfaces/Event';
import { createPaginationEmbed } from '../../Classes/Pagination';
import { Interaction } from 'eris';

      export default class interactionCreateEvent extends Event {
          constructor(client) {
              super(client, "interactionCreate", {

              });
          }

          async run(interaction: Interaction) {

              const { member } = interaction;
              if(!interaction.data) return;
              const split = interaction.data.custom_id;
              const cmd = split.split("#")[0];
              const command = this.client.commands.get(cmd);
              if(command && command.runInteraction) {
                  command.runInteraction(interaction, member);
              }
          }

      }