import Command from "../../Interfaces/Command";
import factionSchema from "../../Schemas/Backend/Faction";
import { v4 } from 'uuid'


export default class FactionCommand extends Command {
    constructor(client) {
        super(client, 'faction', {
            description: "Create, manage and invite others to your faction!",
            category: "Core",
            options: [
                {
                    type: 1,
                    name: 'create',
                    description: 'Create your very own faction!',
                    options: [
                        {
                            type: 3,
                            name: 'name',
                            description: 'The name of the faction.',
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'description',
                            description: 'The description of your faction.',
                            required: false,
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'view',
                    description: 'View either your own or another users faction.',
                    options: [
                        {
                            type: 6,
                            name: 'user',
                            description: 'The user that you would like to view the faction of.',
                            required: false,
                        },
                    ]
                },
                {
                    type: 1,
                    name: 'invite',
                    description: 'Invite another member to join your faction.',
                    options: [
                        {
                            type: 6,
                            name: 'user',
                            description: 'The user that you would like to invite.',
                            required: true,
                        },
                    ]
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {



        switch (interaction.data.options[0].name) {

            case "create": {
                const profile = (await this.client.utils.getProfileSchema(member.id))!!;
                if(profile?.FactionID) {
                    return interaction.createFollowup(`You're already in a faction. Please leave that one before trying to create your own. Your current faction ID is: \`${profile.FactionID}\``);
                }

                const name = subOptions.get("name");
                const description = subOptions.get("description") ?? 'No description set.';
                const factionID = v4();

                const newFactionSchema = new factionSchema({
                    ownerID: member.id,
                    ID: factionID,
                    name: name,
                    description: description,
                    creationDate: Date.now(),
                    memberCount: 1,
                });
                await newFactionSchema.save();
                await profile.updateOne({
                    FactionID: factionID
                });
                const faction = {
                    name: name,
                    description: description,
                    ID: factionID,
                    ownerID: member.id,
                    creationDate: Date.now(),
                    memberCount: 1,
                }
                interaction.createFollowup(`Successfully created your new faction! Your faction ID is: \`${factionID}\``);
                 this.client.emit('factionCreated', faction, member);
                break;
            }

            case "view": {
                const userID = subOptions.get("user") ?? member.id;
                const profile = (await this.client.utils.getProfileSchema(userID))!!;
                if(!profile?.FactionID) {
                    return interaction.createFollowup(`${userID === member.id ? 'You' : 'That user'} are not currently in a faction.`);
                }
                const factionData = await factionSchema.findOne({ ID: profile.FactionID });
                const factionEmbed = new this.client.embed()
                    .setAuthor('Faction Info', this.client.user.avatarURL)
                    .addField('Name', `${factionData.name}`)
                    .addField('Description', `${factionData.description}`)
                    .addField('Member Count',`${factionData.memberCount}`)
                    .addField('Faction ID', `${factionData.ID}`)
                    .setFooter('Velocity Factions', this.client.user.avatarURL)
                    .setColor(this.client.constants.colours.green)
                    .setTimestamp()

                return interaction.createFollowup({ embeds: [factionEmbed] });
            }

            case "invite": {
                const user = subOptions.get("user");
                const profile = (await this.client.utils.getProfileSchema(user))!!;
                const authorProfile = (await this.client.utils.getProfileSchema(member.id))!!;
                const factionData = await factionSchema.findOne({ ID: authorProfile.FactionID });
                if(!authorProfile?.FactionID || !factionData || factionData.ownerID !== member.id) {
                    return interaction.createFollowup(`In order to invite someone to a faction you must own it. Please ask the owner of the faction to invite the member.`);
                }
                const notification = profile?.Notifications["faction"];
                interaction.createFollowup(`<@${user}>, you have been invited to join ${member.mention}'s faction. Their faction ID is: \`${factionData.ID}\`. \n\nTo accept or deny this invite, please use the \`/faction deny <Faction ID>\``);
                if(notification) {
                    const u = (await this.client.getRESTUser(user));
                    if(!u) return;
                    u.getDMChannel((c) => {
                        const invitedEmbed = new this.client.embed()
                            .setAuthor('Faction Invite!')
                            .setDescription(`You have been invited to join ${member.username}#${member.discriminator}'s faction!\nTo accept this invite simply use command below! \n\n \`/faction accept ${factionData.ID}\``)
                            .setFooter('Want to disable these notifications? Use the /notifications command!', this.client.user.avatarURL)
                            .setThumbnail(member.user.avatarURL)
                            .setTimestamp()
                            .setColor(this.client.constants.colours.green)
                        c.createMessage({ embeds: [invitedEmbed] });
                    })
                }
                break;
            }

        }



    }

}
