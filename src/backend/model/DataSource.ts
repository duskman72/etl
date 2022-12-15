import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export const DataSourceSchema = new Schema({
    id: ObjectId,
    name: String,
    type: {
        type: ObjectId,
        ref: "DataSourceType"
    },
    config: Object,
    active: Boolean,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const DataSource = mongoose.model("DataSource", DataSourceSchema);