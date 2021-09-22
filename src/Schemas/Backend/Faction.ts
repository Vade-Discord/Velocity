import mongoose from "mongoose";

export interface IFactions extends mongoose.Document {
    ownerID: string;
    ID: string;
    name: string;
    description: string;
    memberCount: string;

}

const factionSchema = new mongoose.Schema({
    ownerID: String,
    ID: String,
    name: String,
    description: String,
    creationDate: String,
    memberCount: String,

});

const fac = mongoose.model<IFactions>("faction-storage", factionSchema);

export default fac;