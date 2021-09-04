import mongoose from "mongoose";

export interface ITag extends mongoose.Document {
    guildID: string;
    tagName: string;
    tagValue: string;
}

const tagSchema = new mongoose.Schema({
    guildID: String,
    tagName: String,
    tagValue: String,

});

const tags = mongoose.model<ITag>(`Tag`, tagSchema, "guild-tags");

export default tags;