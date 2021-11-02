import { Event } from '../../Interfaces/Event';
import {CommandInteraction, ComponentInteraction, PingInteraction, AutocompleteInteraction} from "eris";
import {main} from "../../api/routers/main";

export default class InteractionCreateEvent extends Event {
    constructor(client) {
        super(client, "interactionCreate", {

        });
    }

    async run(interaction) {

        const guild = interaction.guildID ? (await this.client.getRESTGuild(interaction.guildID)) : null;
        const mainOptions = new Map();
        const subOptions = new Map();
       interaction.data.options?.length >= 1 ?  interaction.data?.options.forEach((option) => {
            mainOptions.set(option.name, option.value);
        }) : null;
     if(interaction.data?.options?.length && interaction.data?.options[0]?.options?.length) {
         interaction.data.options[0].options.forEach((option) => {
             subOptions.set(option.name, option.value);
         })
     }

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
                await command.run(interaction, member, mainOptions, subOptions);
                setTimeout((e) => {
                    mainOptions.clear();
                    subOptions.clear();
                }, 10000)
            }
        } else if (interaction instanceof ComponentInteraction) {
            const data = interaction.data.custom_id;
            const cmd = data.split("#")[0];
            if (cmd == 'pagination') {
                const pages = await this.client.Pagination.get(interaction.message.id)
                //@ts-ignore
                pages.update(interaction)
            }
            const {member} = interaction;
            switch (interaction.data.component_type) {
                case 3: {
                    //console.log(`Selection menu`);
                    const command = this.client.commands.get(cmd);
                    if (!command || !command.run) return;
                    await command.run(interaction, member, mainOptions, subOptions);
                    setTimeout((e) => {
                        mainOptions.clear();
                        subOptions.clear();
                    }, 10000)
                    break;
                }
                case 2: {

                    this.client.emit("clickButton", interaction, member, mainOptions, subOptions)
                    break;
                }
                default:
                    return console.log(`Unknown component type.`);
            }
        } else if (interaction instanceof AutocompleteInteraction) {
            let command = this.client.commands.get(interaction.data.name) || this.client.commands.get(interaction.data.id)
            return command.autocomplete(interaction, interaction.data.options, member)
        } else {
            return console.log(`Unknown interaction type.`);
        }


    };

}