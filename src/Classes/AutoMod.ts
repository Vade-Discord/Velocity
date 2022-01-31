import { Bot } from "../Client/Client";
import {Constants, Guild, Member} from "eris";
import mutedSchema from "../Schemas/Backend/Muted";
import {set} from "mongoose";

export default class AutoMod {

    public readonly client: Bot;
    constructor(client: Bot) {
        this.client = client;
    }

    private reasons = {
        phishing: "sending a malicous link intended to harm/mistreat other members",
        advertising: "sendning a message or link that is likely being used to advertise",
        massjoin: "large amount of members joining, potential raid."
    }

    public async AutoAction(guildId: string, member: Member, type: string) {


        const action = (await this.getAction(guildId, type));
        if(!action) {
            return;
        }
        if(!this.reasons[type]) {
            return new TypeError("Invalid action type provided.");
        }
        await this.executeAction(guildId, action, member.id, type);


    }

    private async getAction(guildId: string, type: string){

        console.log("Receiving action for " + type);

        const guildSchema = (await this.client.utils.getGuildSchema(guildId))!!;
        if(!guildSchema) {
            return;
        }
        if(!guildSchema?.Actions || !guildSchema?.Actions[type]) {
            return null;
        }

        return guildSchema.Actions[type];

    }

    private async moderationLog(guild: Guild, providedTitle: string, providedDescription: string) {
        let moderationEmoji = this.client.constants.emojis.moderation.mention;
        let logChannel;

        const automodChannel = (await this.client.utils.loggingChannel(guild, 'automod'));
        const moderationChannel = (await this.client.utils.loggingChannel(guild, 'moderation'));
        if(automodChannel) {
            logChannel = automodChannel;
        } else if(moderationChannel){
            logChannel = moderationChannel;
        }

        if(!logChannel) {
            return;
        }
        const embed = new this.client.embed()
            .setTitle(`${moderationEmoji} ${providedTitle}`)
            .setDescription(providedDescription)
            .setColor("#F00000")
            .setTimestamp()
            .setFooter("Velocity | Automatic Moderation", this.client.user.avatarURL);

       // @ts-ignore
        logChannel ? logChannel.createMessage({ embeds: [embed] }) : null;
    }

    private async executeAction(guildId: string, action: string, memberId, type: string) {

        let success = true;
        const guild = (await this.client.getRESTGuild(guildId));
        const guildData = (await this.client.utils.getGuildSchema(guildId))!!;
        if(!guild) {
            return new TypeError("Invalid guild provided.");
        }
        // @ts-ignore
        const member: Member = (await guild.getMember(memberId));
        if(!member) {
            return;
        }
        switch (action) {
            case "mute": {

                const botHierarchy = (await this.client.utils.roleHierarchy(guildId, this.client.user.id, memberId));
                if(!botHierarchy) {
                   return;
                }

                let muteRole;
                let mutedRole;
                if(guildData?.Muterole) {
                    let role = (await member.guild.roles.get(guildData.Muterole))!!;
                    if(role) mutedRole = role;
                } else {
                    mutedRole = member.guild.roles.find((m) => m.name.toLowerCase() === 'muted');
                }
                if(!mutedRole && !muteRole) {
                    muteRole = (await guild.createRole({
                        name: 'Muted',
                        permissions: 0,
                        mentionable: false,
                    }));

                    await member.guild.channels.forEach((channel) => {
                        if(channel.permissionsOf(this.client.user.id).has("manageChannels")) {
                            // @ts-ignore
                            channel.editPermission(muteRole.id, 0, Constants.Permissions.sendMessages | Constants.Permissions.voiceSpeak | Constants.Permissions.voiceRequestToSpeak | Constants.Permissions.sendTTSMessages, "role");
                        }
                    });
                } else {
                    muteRole = mutedRole;
                }

                const newSchema = new mutedSchema({
                    userID: memberId,
                    guildID: guildId,
                    roles: member.roles,
                });
                await newSchema.save();
                await this.client.redis.set(`mute.${memberId}.${guildId}`, true, 'EX', 3600);
                await member.edit({
                    roles: [muteRole.id]
                });


                await this.moderationLog(guild, "[Automod] Mute", `**User:** ${member.username}#${member.discriminator} (${member.id})\n**Reason:** ${this.reasons[type]}.`);
                break;
            }
            case "kick": {

                await member.kick("[Automod] Kick").catch(async (e) => {
                    if(e) {
                        await this.moderationLog(guild, "[Automod] Attempted-Kick", `**User:** ${member.username}#${member.discriminator} (${member.id})\n**Info:** Unable to be kicked by the automod due to lack of permissions.\n**Reason:** ${this.reasons[type]}`);
                        success = false;
                    }

                });
                if(!success) {
                    return;
                }
                await this.moderationLog(guild, "[Automod] Kick", `**User:** ${member.username}#${member.discriminator} (${member.id})\n**Reason:** ${this.reasons[type]}.`);


                break;
            }
            case "ban": {

                await member.ban(30, "[Automod] Ban").catch(async (e) => {
                    if(e) {
                        await this.moderationLog(guild, "[Automod] Attempted-Ban", `**User:** ${member.username}#${member.discriminator} (${member.id})\n**Info:** Unable to be banned by the automod due to lack of permissions.\n**Reason:** ${this.reasons[type]}`);
                        success = false;
                    }

                });
                if(!success) {
                    return;
                }
                await this.moderationLog(guild, "[Automod] Ban", `**User:** ${member.username}#${member.discriminator} (${member.id})\n**Reason:** ${this.reasons[type]}.`);


                break;
            }

            default: {
                return;
            }
        }




    }

}

