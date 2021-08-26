import mongoose from "mongoose";

export interface IGiveaways extends mongoose.Document {
    guild: string | number;
    messageID: string;
    endTime: number;
    roleRequired?: string;
    timeSpent?: string;
    voiceRequired?: string;
    invitesRequired?: string;

}

const giveawaySchema = new mongoose.Schema({
    guild: String,
    messageID: String,
    endTime: Number,
    roleRequired: String,
    timeSpent: String,
    voiceRequired: String,
    invitesRequired: String,
});

const queues = mongoose.model<IGiveaways>("giveaways", giveawaySchema);

export default queues;