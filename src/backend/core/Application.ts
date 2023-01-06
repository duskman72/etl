import mongoose from "mongoose";
import { spawn } from "child_process";
import path from "path";
import "../model";
import { Logger } from "../../shared/Logger";
import { WebServer } from "./WebServer";

export class Application {
    public static run = async () => {
        mongoose.set('strictQuery', true);
        
        try {
            await mongoose.connect("mongodb://localhost/inventory");
        }
        catch( e ) {
            Logger.emerg("Unable to connect to MongoDB")
            return;
        }

        Logger.info("Starting cron service...")
        const cron = process.cwd().concat(path.sep).concat("dist").concat(path.sep).concat("cron.js");
        const p = spawn(`node`, [cron]);
        p.stdout.on('data', function (data) {
            console.log( `${data}`.trim() )
        });
        p.unref();

        WebServer.start();
    }
}