import mongoose from "mongoose";

export interface ICount extends mongoose.Document {
    userID: string | number;
    guildID: string;
    amount: number;

}

const countSchema = new mongoose.Schema({
    userID: String,
    guildID: String,
    amount: Number,
});

const counts = mongoose.model<ICount>("guild-counters", countSchema);

export default counts;