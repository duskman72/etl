import mongoose from "mongoose";
import { WebServer } from "./WebServer";
import { spawn } from "child_process";
import path from "path";
import "../model";

export class Application {
    public static run = async () => {
        mongoose.set('strictQuery', true);
        await mongoose.connect("mongodb://localhost/inventory");

        const cron = process.cwd().concat(path.sep).concat("dist").concat(path.sep).concat("cron.js");
        const p = spawn(`node`, [cron]);
        p.stdout.on('data', function (data) {
            console.log( `${data}`.trim() )
        });
        p.unref();

        WebServer.start();
    }
}