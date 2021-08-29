import Command from "../../Interfaces/Command";

export default class TagCommand extends Command {
    constructor(client) {
        super(client, 'tag', {
            description: "Create, edit, remove, list or view a tag.",
            category: "Configuration",
            userPerms: ['manageGuild'],
            adminCommand: true,
            options: [
                {
                    type: 1,
                    name: 'create',
                    description: 'Create a tag.',
                    options: [
                        {
                            name: 'tag-name',
                            description: 'The name that the tag should have.',
                            type: 3,
                            required: true,
                        }
                    ]
                }
            ]
        });
    }
    async run(interaction, member) {



    }

}
