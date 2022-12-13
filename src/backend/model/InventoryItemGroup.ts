import mongoose, { Schema } from "mongoose";
import { InventoryGroupSchema } from "./InventoryGroup";

const ObjectId = Schema.Types.ObjectId;

export const InventoryItemGroupSchema = new Schema({
    id: ObjectId,
    name: String,
    group: {
        type: ObjectId,
        ref: "InventoryGroup"
    },
    createdAt: Date
});

export const InventoryItemGroup = mongoose.model("InventoryItemGroup", InventoryItemGroupSchema);
