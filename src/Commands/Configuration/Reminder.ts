import Command from "../../Interfaces/Command";
import reminders from "../../Schemas/Backend/Reminders";
import ms from 'ms';
import {Paginate} from "@the-nerd-cave/paginate";
import {createPaginationEmbed} from "../../Classes/Pagination";

export default class ReminderCommand extends Command {
    constructor(client) {
        super(client, 'reminder', {
            description: "Set a reminder, view your reminders or delete them.",
            category: "Configuration",
            options: [
                {
                    type: 1,
                    name: 'set',
                    description: 'Set a reminder.',
                    options: [
                        {
                            type: 3,
                            name: 'reminder',
                            description: 'What you would like to be reminded about.',
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'time',
                            description: 'How long until you are reminded?',
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'delete',
                    description: 'Delete a reminder.',
                    options: [
                        {
                            type: 10,
                            name: 'id',
                            description: 'The reminder ID to be deleted. (View the id via the list command)',
                            required: true,
                        },
                    ]
                },
                {
                    type: 1,
                    name: 'list',
                    description: 'List all of your reminders.',
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {

        const fetchList = (await reminders.find({ userID: member.id }));
        const embed = new this.client.embed()
            .setColor(this.client.constants.colours.green)

        switch(interaction.data.options[0].name) {

            case "set": {
                let id;

                if(fetchList?.length && fetchList.length >= 10) {
                    return interaction.createFollowup(`You may only set up to 10 reminders.`);
                }

                const reminder = subOptions.get("reminder");
                const time = subOptions.get("time");
                const msTime = ms(time);
                if(!msTime) {
                    return interaction.createFollowup(`You seem to have provided an invalid length of time. Example: "1d" (1 day).`);
                }


                if (fetchList.length > 0) {
                    id = fetchList[fetchList.length - 1].reminderID + 1;
                } else id = 1;

                const data = new reminders({
                    userID: member.id,
                    reminder: reminder,
                    channelID: interaction.channel.id,
                    reminderID: id,
                });
                await data.save();
                await this.client.redis.set(`reminder.${member.id}.${id}`, true, 'EX', Math.ceil(msTime / 1000));

                embed
                    .setTitle("✅ You have successfully set a reminder")
                    .setDescription(
                        `I will remind you the following in \`${this.client.utils.msToTime(
                            msTime
                        )}\`\n\n> ${reminder}`
                    );

                interaction.createFollowup({ embeds: [embed] });
                break;
            }

            case "delete": {
                const reminderID = subOptions.get("id");
                if(reminderID >= 12) {
                    return interaction.createFollowup(`A reminder ID shouldn't be higher than 10.`);
                }
                const data = await reminders.findOne({ userID: member.id, reminderID: reminderID });
                if(!data) {
                    return interaction.createFollowup(`Unable to locate a reminder with that ID.`);
                } else {
                    let ar = {
                        reminderID: { $gt: data.reminderID },
                        userID: member.id,
                    };
                    reminders.updateMany(
                        ar,
                        { $inc: { reminderID: -1 } },
                    );
                    embed
                        .setTitle("✅ Success")
                        .setDescription(
                            `${member.mention} has deleted reminder \`#${reminderID}\`!`
                        );
                    await data.delete();
                    return interaction.createFollowup({ embeds: [embed] });
                }

            }

            case "list": {
                const allReminders = await reminders.find({ userID: member.id });
                if(!allReminders?.length) {
                    return interaction.createFollowup(`Unable to locate any reminders.`);
                }

                const commandsToPaginate = allReminders
                    .map(
                        (reminder) =>
                            `**#${reminder.reminderID}** \n\n> ${reminder.reminder}`
                    );
                const pages = new Paginate(commandsToPaginate, 8).getPaginatedArray();
                const embeds = pages.map((page, index) => {
                    return new this.client.embed()
                        .setTitle(`${member.username}#${member.discriminator}'s Reminders`)
                        .setDescription(
                            page.join("\n") ??
                            `No more reminders to be listed on page ${index + 1}`
                        )
                        .setTimestamp();
                });

                if (embeds.length == 1) {
                    return interaction.createFollowup({
                        embeds: embeds,
                        components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                style: 5,
                                label: "Website",
                                url: `https://vade-bot.com`,
                            }]
                        }]
                    });
                } else if(embeds.length >= 2) {
                    return await createPaginationEmbed(this.client, interaction, embeds, {});
                }
            }
        }








    }

}
