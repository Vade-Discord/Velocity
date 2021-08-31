import mongoose from "mongoose";

export interface IMute extends mongoose.Document {
    userID: string | number;
    guildID: string;
    roles: string[];

}

const mutedSchema = new mongoose.Schema({
    userID: String,
    guildID: String,
    roles: Array,
});

const mutes = mongoose.model<IMute>("guild-muted", mutedSchema);

export default mutes;