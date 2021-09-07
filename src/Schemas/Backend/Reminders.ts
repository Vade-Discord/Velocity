import mongoose from "mongoose";

export interface IReminder extends mongoose.Document {
    userID: string | number;
    reminder: string;
    channelID: string;
    reminderID: number;

}

const reminderSchema = new mongoose.Schema({
    userID: String,
    reminder: String,
    channelID: String,
    reminderID: Number,
});

const reminders = mongoose.model<IReminder>("user-reminders", reminderSchema);

export default reminders;