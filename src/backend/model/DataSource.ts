import mongoose, { Schema } from "mongoose";
import { DataSourceType } from "./DataSourceType";

const ObjectId = Schema.Types.ObjectId;

export const DataSourceSchema = new Schema({
    id: ObjectId,
    name: String,
    dataSourceType: {
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