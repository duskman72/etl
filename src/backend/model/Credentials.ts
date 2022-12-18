import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export enum SupportedCredentialsTypes {
    KEY = "apikey",
    USER = "user",
    OAUTH = "oauth",
    BEARER = "bearer",
    UNKNOWN = "unknown"
}

export const CredentialsSchema = new Schema({
    id: ObjectId,
    name: String,
    type: {
        type: String,
        enum: SupportedCredentialsTypes,
        default: SupportedCredentialsTypes.UNKNOWN
    },
    config: Object,
    active: Boolean,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

export const Credentials = mongoose.model("Credentials", CredentialsSchema);