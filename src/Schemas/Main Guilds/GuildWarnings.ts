import mongoose from "mongoose";

export interface IWarnings extends mongoose.Document {
    guild: string;
    user: string;
    total: number,
    id: string,
    time: Date,
    reasons: string[];

}

const queueSchema = new mongoose.Schema({
    guild: String,
    user: Object,
    total: Number,
    id: String,
    time: Date,
    reasons: Array()
});

const queues = mongoose.model<IWarnings>("guild-warnings", queueSchema);

export default queues;