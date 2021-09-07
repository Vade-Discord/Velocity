import mongoose from "mongoose";

export interface IRoles extends mongoose.Document {
    guildID: string;
    roles: Array<string>;
    enabled: boolean;
}

const reqString = {
    type: String,
    required: true,
};
const reqArray = {
    type: Array,
    required: true,
};

const reqBoo = {
    type: Boolean,
    required: true,
};

const guildSchema = new mongoose.Schema({
    guildID: reqString,
    roles: reqArray,
    enabled: reqBoo,
});

const guilds = mongoose.model<IRoles>("autoroles", guildSchema);

export default guilds;