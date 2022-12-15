import mongoose, { Schema } from "mongoose";
import { DataSourceSchema } from "./DataSource";

const ObjectId = Schema.Types.ObjectId;

const DataSourceTypeSchema = new Schema({
    id: ObjectId,
    typeName: String,
    active: Boolean,
    dataSources: [{
        type: DataSourceSchema,
        ref: "DataSource"
    }],
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const DataSourceType = mongoose.model("DataSourceType", DataSourceTypeSchema);