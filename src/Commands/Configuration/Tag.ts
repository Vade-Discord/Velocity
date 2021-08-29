import Command from "../../Interfaces/Command";
import tagSchema from "../../Schemas/Main Guilds/TagSchema";

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
                        },
                        {
                            name: 'tag-value',
                            description: 'The value of the tag. (What the bot will respond with when someone uses it)',
                            type: 3,
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'view',
                    description: 'Take a look at a tag.',
                    options: [
                        {
                            name: 'tag-name',
                            description: 'The name that the tag should have.',
                            type: 3,
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'edit',
                    description: 'Edit a tags value.',
                    options: [
                        {
                            name: 'tag-name',
                            description: 'The tag to edit.',
                            type: 3,
                            required: true,
                        },
                        {
                            name: 'tag-value',
                            description: 'The new value of the tag.',
                            type: 3,
                            required: true,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'delete',
                    description: 'Delete a tag.',
                    options: [
                        {
                            name: 'tag-name',
                            description: 'The tag to delete.',
                            type: 3,
                            required: true,
                        },
                    ]
                },
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const subCommand = interaction.data.options;
        const tagName = subOptions.get("tag-name");

        switch(subCommand[0].name) {
            case "create": {
                if((await tagSchema.find({ guildID: interaction.guildID}))?.length >= 5 && !(await this.client.utils.checkPremium(interaction.guildID))) {
                    return interaction.createFollowup(`Sorry! Only vade premium servers can have more than 5 tags!`);
                }
                const tagValue = subOptions.get("tag-value");
                if((await tagSchema.findOne({ guildID: interaction.guildID, tagName: tagName }))) {
                    return interaction.createFollowup(`Oops! Looks like you already have a tag created with that name!`);
                }

                const newSchema = new tagSchema({
                    guildID: interaction.guildID,
                    tagName: tagName,
                    tagValue: tagValue,
                });

                await newSchema.save();
                interaction.createFollowup(`Successfully created that tag!`);

                break;
            }

            case "delete":
                const schema = (await tagSchema.findOne({ guildID: interaction.guildID, tagName: tagName }));
                if(!schema) {
                    return interaction.createFollowup(`Oops! There doesn't seem to be a tag that exists with that name!`);
                } else {
                    await schema.delete();
                    interaction.createFollowup(`Successfully deleted that tag!`);
                break;
            }

            case "edit": {
                const tagValue = subOptions.get("tag-value");
                const schema = (await tagSchema.findOne({ guildID: interaction.guildID, tagName: tagName }));
                if(!schema) {
                    return interaction.createFollowup(`Oops! There doesn't seem to be a tag that exists with that name!`);
                }
                if(tagValue !== schema.tagValue) {
                    await schema.updateOne({
                        tagValue: tagValue,
                    });

                    interaction.createFollowup(`Successfully updated the tag.`);
                } else {
                    return interaction.createFollowup(`Oops! The value that you provided was the same as it currently is.`);
                }
                break;
            }

            case "view": {
                const schema = (await tagSchema.findOne({ guildID: interaction.guildID, tagName: tagName }));
                if(!schema) {
                    return interaction.createFollowup(`Oops! There doesn't seem to be a tag that exists with that name!`);
                } else {
                    interaction.createFollowup(schema?.tagValue ?? 'Unable to locate the tag value!');
                }



                break;
            }

            default: {
                return;
            }
        }


    }

}
