import mongoose from "mongoose";

export interface IPlaylist extends mongoose.Document {
  name: string;
  description: string;
  ownerID: string;
  likes?: number;
  dislikes?: number;
  uses?: number;
  playlistArray: unknown[];
  public?: boolean;

}

const queueSchema = new mongoose.Schema({
    name: String,
    description: String,
    ownerID: String,
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0},
    uses: { type: Number, default: 0 },
    playlistArray: Array,
    public: { type: Boolean, default: false }
});

const playlists = mongoose.model<IPlaylist>("playlists", queueSchema);

export default playlists;