import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    auth: String,
    active: Boolean,
    createdAt: Date
});

export const User = mongoose.model("User", UserSchema);
