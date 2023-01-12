import mongoose, { Schema } from "mongoose";
import db from "../config/databases";

mongoose.set('strictQuery', true);
const ObjectId = Schema.Types.ObjectId;

export const LogEntrySchema = new Schema({
    id: ObjectId,
    time: Date,
    level: String,
    context: String,
    message: String,
    tags: Array<String>
}, {collection: "logs"});

export const LogEntry = db.fluentd.model("LogEntry", LogEntrySchema);