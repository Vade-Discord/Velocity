import mongoose from "mongoose";

export interface IQueues extends mongoose.Document {
    guild: string | number;
    queue: any;
    length: number,
    textChannel: string,

}

const queueSchema = new mongoose.Schema({
    guild: String,
    queue: Object,
    length: Number,
    textChannel: String,
});

const queues = mongoose.model<IQueues>("guild-queues", queueSchema);

export default queues;