import { Document, Model, model, models, Schema } from "mongoose";

interface IVoice extends Document {
    user: string;
    total: number;
}

export const bankSchema = new Schema({
    user: String,
    total: Number,
});

const bank =
    (models["vc-storages"] as Model<IVoice>) ||
    model<IVoice>("vc-storages", bankSchema);

export default bank;