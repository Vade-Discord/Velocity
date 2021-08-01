import { Document, Model, model, models, Schema } from "mongoose";

interface IVoice extends Document {
    user: string,
  Join: {
      time: string,
  },
}

export const bankSchema = new Schema({
    user: String,
 Join: {
     time: String,
 },
});

const bank =
    (models["vc-storages"] as Model<IVoice>) ||
    model<IVoice>("vc-storages", bankSchema);

export default bank;