import { Event } from '../../Interfaces/Event';
import {CommandInteraction, ComponentInteraction, PingInteraction} from "eris";

export default class InteractionCreateEvent extends Event {
    constructor(client) {
        super(client, "interactionCreate", {

        });
    }

    async run(interaction) {

        const guild = interaction.guildID ? await this.client.getRESTGuild(interaction.guildID) : null;

        const member = guild ? await guild.getRESTMember(interaction.member.id) : interaction.member;
        if (interaction instanceof PingInteraction) {
            return interaction.acknowledge();
        } else if (interaction instanceof CommandInteraction) {
            await interaction.acknowledge();
            if (!interaction.data) return;
            const cmd = interaction.data?.name?.toLowerCase();

            if (cmd) {
                const command = await this.client.commands.get(cmd);

                if (!command) return;
                const check = await this.client.utils.runPreconditions(interaction, member, guild, command);
                if (check) return;
                command.run(interaction, member);
            }
        } else if (interaction instanceof ComponentInteraction) {
            const data = interaction.data.custom_id;
            const cmd = data.split("#")[0];
            if (cmd == 'pagination') {
                const pages = await this.client.Pagination.get(interaction.message.id)
                //@ts-ignore
                pages.run(interaction)
            }
            const {member} = interaction;
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
                    return console.log(`Unknown component type.`);
            }
        } else {
            return console.log(`Unknown interaction type.`);
        }


    };

}