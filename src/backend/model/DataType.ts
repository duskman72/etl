import mongoose, { Schema } from "mongoose";
import { DataSourceSchema } from "./DataSource";

const ObjectId = Schema.Types.ObjectId;

export const DataTypeSchema = new Schema({
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

export const DataType = mongoose.model("DataType", DataTypeSchema);