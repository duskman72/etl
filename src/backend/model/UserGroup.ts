import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const UserGroupSchema = new Schema({
    id: ObjectId,
    name: String,
    createdAt: Date
});

export const UserGroup = mongoose.model("UserGroup", UserGroupSchema);
