import mongoose from "mongoose";
import * as models from "./model";
import { Logger } from "../shared/Logger";

const getJobs = async () => {
    const jobs = (await models.RepetitiveJob.find({ repeat: true }).populate("source")).filter( job => job.source );
    Logger.info(`found ${jobs.length} repeatable jobs`);
}

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost/inventory").then( () => {
    Logger.info("Connected to mongodb database");
    getJobs();
    setInterval(() => {
        getJobs();
    }, 1000 * 60);
})
