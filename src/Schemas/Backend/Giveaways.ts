import mongoose from "mongoose";

export interface IGiveaways extends mongoose.Document {
    guildID: string;
    messageID: string;
    prize: string;
    winners: number;
    channelID: string;
    endTime: number;
    roleRequired?: string;
    guildTime?: number;
    voiceRequired?: number;
    invitesRequired?: string;
    entrants: string[];
    giveawayHost: string;

}

const giveawaySchema = new mongoose.Schema({
    guildID: String,
    prize: String,
    winners: Number,
    messageID: String,
    channelID: String,
    endTime: Number,
    roleRequired: String,
    guildTime: Number,
    voiceRequired: Number,
    invitesRequired: String,
    entrants: Array,
    giveawayHost: String,
});

const queues = mongoose.model<IGiveaways>("giveaways", giveawaySchema);

export default queues;