import mongoose from "mongoose";
import { WebServer } from "./WebServer";
import "../model";

export class Application {
    public static run = async () => {
        mongoose.set('strictQuery', true);
        await mongoose.connect("mongodb://localhost/inventory");

        WebServer.start();
    }
}