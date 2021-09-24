import { Schema, model, Document } from 'mongoose';

export interface InviteMember extends Document {
    guildID: string;
    userID: string;
    inviter: string;
    date: number;
}

const schema = new Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    inviter: { type: String, default: "" },
    date: { type: Number, default: Date },
});

const guild = model<InviteMember>("inviteMember", schema);
export default guild;