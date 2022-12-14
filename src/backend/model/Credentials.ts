import mongoose, { Schema } from "mongoose";
import db from "../config/databases";

mongoose.set('strictQuery', true);
const ObjectId = Schema.Types.ObjectId;

export enum SupportedCredentialsTypes {
    KEY = "apikey",
    USER = "user",
    OAUTH = "oauth",
    BEARER = "bearer",
    BASIC = "basic",
    NONE = "none"
}

export const CredentialsSchema = new Schema({
    id: ObjectId,
    name: String,
    type: {
        type: String,
        enum: SupportedCredentialsTypes,
        default: SupportedCredentialsTypes.NONE
    },
    config: Object,
    active: Boolean,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const Credentials = db.inventory.model("Credentials", CredentialsSchema);