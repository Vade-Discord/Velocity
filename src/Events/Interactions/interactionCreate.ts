    import { Event } from '../../Interfaces/Event';

      export default class InteractionCreateEvent extends Event {
          constructor(client) {
              super(client, "interactionCreate", {

              });
          }

          async run(interaction) {

            switch(interaction.type) {
                case 1: {
                    return interaction.acknowledge();
                }
                case 2: {
                    await interaction.acknowledge();
                    if (!interaction.data) return;
                    const cmd = interaction.data?.name;
                    const { member } = interaction;

                    if (cmd) {
                        const command = await this.client.commands.get(cmd);
                        if (!command) return;
                        const check = await this.client.utils.runPreconditions(interaction, command);
                        if (check) return;
                        command.run(interaction, member);
                    }
                    break;
                }
                case 3: {
                    const data = interaction.data.custom_id;
                    const cmd = data.split("#")[0];    
                    if (cmd == 'pagination') {
                        const pages = await this.client.Pagination.get(interaction.message.id)
                        //@ts-ignore
                        pages.run(interaction)
                    }
                    const { member } = interaction;
                    switch (interaction.data.component_type) {
                        case 3: {
                            console.log(`Selection menu`);
                            const command = this.client.commands.get(cmd);
                            if (!command || !command.run) return;
                            await command.run(interaction, member);
                            break;
                        }
                        case 2: {
                            const command = this.client.commands.get(cmd);
                            if (!command || !command.run) return;
                            await command.run(interaction, member);
                            break;
                        }
                        default:
                            return console.log(`Unknown interaction type.`);
                    }
                }
                break;
                default: {
                    return;
                }
            }             

          };

      }