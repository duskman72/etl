import mongoose, { Schema } from "mongoose";
import { DataSourceSchema } from "./DataSource";
import db from "../config/databases";

mongoose.set('strictQuery', true);
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

export const DataType = db.inventory.model("DataType", DataTypeSchema);