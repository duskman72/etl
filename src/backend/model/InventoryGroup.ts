import mongoose, { Schema } from "mongoose";
import { InventoryItemGroupSchema } from "./InventoryItemGroup";

const ObjectId = Schema.Types.ObjectId;

export const InventoryGroupSchema = new Schema({
    id: ObjectId,
    name: String,
    children: [{
        type: InventoryItemGroupSchema,
        ref: "InventoryItemGroup"
    }],
    createdAt: Date
});

export const InventoryGroup = mongoose.model("InventoryGroup", InventoryGroupSchema);
