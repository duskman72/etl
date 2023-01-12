import mongoose, { Schema } from "mongoose";
import db from "../config/databases";

mongoose.set('strictQuery', true);
const ObjectId = Schema.Types.ObjectId;

export const DataSourceSchema = new Schema({
    id: ObjectId,
    name: String,
    type: {
        type: ObjectId,
        ref: "DataType"
    },
    config: Object,
    active: Boolean,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const DataSource = db.inventory.model("DataSource", DataSourceSchema);