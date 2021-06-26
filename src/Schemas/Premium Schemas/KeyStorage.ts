import mongoose from "mongoose";

export interface IKey extends mongoose.Document {
    _id: string;
    key: string;
    expirationTime: string;
    createdBy: string;
    createdOn: string;
}

const keySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    key: String,
    expirationTime: String,
    createdBy: String,
    createdOn: String,
});

const guilds = mongoose.model<IKey>("premium-keys", keySchema);

export default guilds;