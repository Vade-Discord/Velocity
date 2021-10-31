import Command from "../../Interfaces/Command";
import keySchema from "../../Schemas/Premium-Schemas/KeyStorage";
import humanize from 'humanize-duration';

export default class PremiumCommand extends Command {
    constructor(client) {
        super(client, 'premium', {
            description: "All premium-related commands.",
            category: "Configuration",
            options: [
                {
                    type: 1,
                    name: 'redeem',
                    description: 'Redeem a premium key for the current server.',
                    options: [
                        {
                            type: 3,
                            name: 'key',
                            description: 'The key you would like to redeem.',
                            required: true,
                        }
                    ]
                }
            ]
        });
    }
    async run(interaction, member, options, subOptions) {


        switch(interaction.data.options[0].name) {

            case "redeem": {


                const { PRIVATE, GUILDS } = this.client.config;
                const keyChannel = this.client.guilds.get(GUILDS.main)?.channels.get(PRIVATE.keylog);
                if(keyChannel.type !== 0) return;
                const key = subOptions.get("key");
                if(!key.startsWith("Velocity_")) {
                    return interaction.createFollowup(`The key you provided was invalid.`);
                }

                const checkKey = await keySchema.findOne({ key: key });
                if(!checkKey) return interaction.createFollowup({ content: `Invalid key provided!`});
                if(checkKey.expirationTime <= Date.now()) {
                    interaction.createFollowup({content: `That key has expired!`});


                    let deletedEmbed = new this.client.embed()
                        .setTitle(`Key Schema Deleted!`)
                        .addField(`Key`, `\`${key}\``)
                        .addField(`Delete reason`, `The key has expired.`)
                        .addField(`Guild`, `${member.guild.name} (${interaction.guildID})`)
                        .setFooter(`Velocity | Key logging`)
                        .setColor(`#F00000`)
                        .setTimestamp();

                    keyChannel ? keyChannel?.createMessage({embeds: [deletedEmbed] }) : null;
                    await checkKey.delete();

                    return;

                }

                const guild = (await this.client.utils.getGuildSchema(interaction.guildID))!!;

                if(!guild?.Premium?.active) {
                    await guild.updateOne({
                        Premium: {
                            key: key,
                            redeemedOn: Date.now(),
                            expiresOn: checkKey.expirationTime,
                            redeemedBy: member.id,
                            active: true,
                            stacked: false,
                        }
                    });
                    let premiumRedeemed = new this.client.embed()
                        .setTitle(`Premium Redeem`)
                        .addField(`Key`, `\`${key}\``)
                        .addField(`Premium Activation Reason`, `A user has redeemed a premium key in the server.`)
                        .addField(`Guild`, `${member.guild.name} (${interaction.guildID})`)
                        .setFooter(`Velocity | Key logging`)
                        .setColor(`#cefad0`)
                        .setTimestamp();

                    keyChannel ?  keyChannel?.createMessage({ embeds: [premiumRedeemed] }) : null;

                    return interaction.createFollowup(`Successfully activated premium for this server!`)
                } else {
                    const currentTime = guild.Premium.expiresOn;
                    const newTime = currentTime + checkKey.length;
                    await guild.updateOne({
                        Premium: {
                            key: checkKey.key,
                            redeemedOn: Date.now(),
                            expiresOn: newTime,
                            redeemedBy: member.id,
                            active: true,
                            stacked: true,
                        }
                    });

                    let addedTimeEmbed = new this.client.embed()
                        .setTitle(`Premium Time Added`)
                        .addField(`Key`, `\`${key}\``)
                        .addField(`Time Added Reason`, `Another key was redeemed resulting in a stack forming.`)
                        .addField(`Guild`, `${member.guild.name} (${interaction.guildID})`)
                        .setFooter(`Velocity | Key logging`)
                        .setColor(`#cefad0`)
                        .setTimestamp();

                    keyChannel ?  keyChannel?.createMessage({ embeds: [addedTimeEmbed] }) : null;
                    await checkKey.delete();
                    return interaction.createFollowup({ content: `Successfully added \`${humanize(checkKey.length)}\`to this guilds Premium Subscription` });
                }


            }

            default: {
                return;
            }
        }

    }

}
