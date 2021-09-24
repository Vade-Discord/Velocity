import { Schema, model } from "mongoose";

export interface IInviter extends Document {
    guildID: string,
    userID: string,
    total: number,
    regular: number,
    bonus: number,
    leave: number,
    fake: number,
}

const schema = new Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    total: { type: Number, default: 0, min: 0 },
    regular: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    leave: { type: Number, default: 0, min: 0 },
    fake: { type: Number, default: 0, min: 0 },
});

const guild = model<IInviter>("inviter", schema);

export default guild;