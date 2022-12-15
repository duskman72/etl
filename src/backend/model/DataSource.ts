import mongoose, { Schema } from "mongoose";
import { DataSourceTypeSchema } from "./DataSourceType";

const ObjectId = Schema.Types.ObjectId;

export const DataSourceSchema = new Schema({
    id: ObjectId,
    name: String,
    type: {
        type: ObjectId,
        ref: "DataSourceType"
    },
    active: Boolean,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const DataSource = mongoose.model("DataSource", DataSourceSchema);