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
                const command = await this.client.commands.get(cmd);
                if(!command) return;
               const check = await this.client.utils.runPreconditions(interaction, command);
               if(check) return;
                command.run(interaction, member);
            }
          }

      }