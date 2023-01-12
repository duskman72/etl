import mongoose, { Schema } from "mongoose";
import db from "../config/databases";

mongoose.set('strictQuery', true);
const ObjectId = Schema.Types.ObjectId;

export const RepetitiveJobSchema = new Schema({
    id: ObjectId,
    name: String,
    source: {
        type: ObjectId,
        ref: "DataSource"
    },
    repeat: {
        type: Boolean,
        default: false
    },
    repeatType: {
        type: String,
        default: undefined
    },
    repeatValue: {
        type: Number,
        default: 0
    },
    jobDate: Date,
    active: Boolean,
    lastExec: {
        type: Date,
        default: new Date("1970-01-01")
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const RepetitiveJob = db.inventory.model("RepetitiveJob", RepetitiveJobSchema);