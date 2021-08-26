import Command from "../../Interfaces/Command";

export default class EmitCommand extends Command {
    constructor(client) {
        super(client, 'emit', {
            aliases: [""],
            description: "Emit an event directly through the bot.",
            category: "Development",
            devOnly: true,
            options: [
                {
                    type: 3,
                    name: 'event',
                    description: `The event to emit.`,
                    required: true,
                }
            ],
            guildOnly: true,
        });
    }
    async run(interaction, member) {

        if(!this.client.owners.includes(member.id)) {
            return interaction.createFollowup(`Sorry! Only the bot developers can use this command!`);
        }

        const event = interaction.data.options?.filter(m => m.name === "event")[0].value;

        switch(event?.toLowerCase()) {
            case "guildmemberadd": {
                this.client.emit('guildMemberAdd', member.guild, member);
                break;
            }

            case "guildcreate": {
                this.client.emit('guildCreate', member.guild);
                break;
            }
            case "guilddelete": {
                this.client.emit('guildDelete', member.guild);
                break;
            }
        }

        interaction.createFollowup(`Successfully emit *${event}*.`);

    }

}
