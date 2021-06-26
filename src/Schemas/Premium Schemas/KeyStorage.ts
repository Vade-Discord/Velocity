import mongoose from "mongoose";

export interface IKey extends mongoose.Document {
    _id: string;
    key: string;
    expirationTime: number;
    length: number,
    createdBy: string;
    createdOn: number;
}

const keySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    key: String,
    expirationTime: Number,
    length: Number,
    createdBy: String,
    createdOn: Number,
});

const guilds = mongoose.model<IKey>("premium-keys", keySchema);

export default guilds;