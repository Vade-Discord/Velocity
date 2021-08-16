import mongoose from "mongoose";

export interface IGuild extends mongoose.Document {
    _id: string;
    guildID: string;
    guildName: string;
    prefix: string;
    welcomeChannel: string;
    inviteChannel: string;
    levelChannel: string;
    welcomeMessage: string;
    bumpChannel: string;
    bumpColour: string;
    welcomeType: string;
    logChannelID: string;
    Suggestion: string;
    ModRole: Array<string>;
    AdminRole: Array<string>;
    AntiAlt: boolean;
    AntiAltDays: number;
    reactionDM: boolean;
    cleanCommands: boolean;
    ignoreChannels: Array<string>;
    ignoreCommands: Array<string>;
    ignoreAntiad: Array<string>;
    ignoreAutomod: Array<string>;
    description: string;
    colour: string;
    footer: string;
    Starboard: string;
    StarAmount: number;
    Automod: boolean;
    Premium?: {
        key?: string;
        redeemedOn?: number;
        expiresOn?: number,
        redeemedBy?: string;
        active?: boolean;
        stacked?: boolean;
    }
    Logging?: {
        message?: string;
        welcome?: string;
        invites?: string;
        leave?: string;
        voice?: string;
        role?: string;
        moderation?: string;
        user?: string;
        channel?: string;
        giveaway?: string;
    }
}

const guildSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    prefix: String,
    welcomeChannel: String,
    inviteChannel: String,
    levelChannel: String,
    bumpChannel: String,
    bumpColour: String,
    Starboard: String,
    StarAmount: Number,
    welcomeMessage: String,
    welcomeType: String,
    logChannelID: String,
    Suggestion: String,
    ModRole: Array,
    AdminRole: Array,
    AntiAlt: Boolean,
    AntiAltDays: Number,
    reactionDM: Boolean,
    cleanCommands: Boolean,
    ignoreChannels: Array,
    ignoreCommands: Array,
    ignoreAntiad: Array,
    ignoreAutomod: Array,
    description: String,
    colour: String,
    footer: String,
    Automod: Boolean,
    Premium: {
        key: String,
        redeemedOn: String,
        expiresOn: Number,
        redeemedBy: String,
        active: Boolean,
        stacked: Boolean,
    },
    Logging: {
        message: String,
        welcome: String,
        invites: String,
        voice: String,
        role: String,
        moderation: String,
        user: String,
        channel: String,
        giveaway: String,
    }
});

const guilds = mongoose.model<IGuild>(`Guild`, guildSchema, "guilds");

export default guilds;