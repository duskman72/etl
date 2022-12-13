import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const DataSourceTypeSchema = new Schema({
    id: ObjectId,
    name: String,
    typeName: String,
    active: Boolean,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const DataSourceType = mongoose.model("DataSourceType", DataSourceTypeSchema);