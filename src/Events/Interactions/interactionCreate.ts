  import { Event } from '../../Interfaces/Event';

      export default class InteractionCreateEvent extends Event {
          constructor(client) {
              super(client, "interactionCreate", {

              });
          }

          async run(interaction) {

              await interaction.acknowledge();
            if(!interaction.data) return;
            const cmd = interaction.data?.name;
            const { member } = interaction;
            if(cmd) {
                await this.client.commands.get(cmd).run(interaction, member)
            }
          }

      }