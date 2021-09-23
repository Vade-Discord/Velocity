import { Document, Model, model, models, Schema } from "mongoose";

interface shopItem {
    name?: string,
    amount?: number,
}

interface IBank extends Document {
    User: string;
    Job: string;
    Wallet: number;
    Bank: number;
    HourlyTime: number;
    DailyTime: number;
    WeeklyTime: number;
    MonthlyTime: number;
    JobSwitchTime: number;
    FactionID: string;
    Wage: number;
    Worked: boolean;
    LastPaid: number;
    Passive: boolean;
    Partner: string;
    MentionNotif: boolean;
    Language: string;
    Blacklisted: boolean;
    Newsletter: boolean;
    Notifications?: {
        moderation?: boolean;
        robbery?: boolean;
        giveaway?: boolean;
        economy?: boolean;
    },
    Inventory: shopItem[];
}

export const bankSchema = new Schema({
    User: {
        type: String,
        required: true,
    },
    Blacklisted: {
        type: Boolean,
        required: false,
    },
    Job: {
        type: String,
        required: false,
    },
    Wage: {
        type: String,
        required: false,
    },
    Passive: {
        type: Boolean,
        required: false,
    },
    Partner: {
        type: String,
        required: false,
    },
    Pet: {
        type: String,
        required: false,
    },
    LastPaid: {
        type: Number,
        required: false,
    },
    Worked: {
        type: Boolean,
        required: false,
    },
    Wallet: {
        type: Number,
        required: true,
        default: 0,
    },
    Bank: {
        type: Number,
        required: true,
        default: 0,
    },
    HourlyTime: {
        type: Number,
        required: false,
    },
    DailyTime: {
        type: Number,
        required: false,
    },
    WeeklyTime: {
        type: Number,
        required: false,
    },
    MonthlyTime: {
        type: Number,
        required: false,
    },
    JobSwitchTime: {
        type: Number,
        required: false,
    },
    MentionNotif: {
        type: Boolean,
        required: false,
    },
    Language: {
        type: String,
        required: false,
    },
    Newsletter: {
        type: Boolean,
        required: false,
    },
    Notifications: {
        moderation: Boolean,
        robbery: Boolean,
        giveaway: Boolean,
        economy: Boolean,
    },
   FactionID: String,
    Inventory: Array,
});

const bank =
    (models["econ-storages"] as Model<IBank>) ||
    model<IBank>("econ-storages", bankSchema);

export default bank;