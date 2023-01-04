import mongoose from "mongoose";
import * as models from "./model";
import moment from "moment";

const log = (message) => {
    console.log(`${moment(new Date()).format("YYYY-MM-DD HH:mm")} [CRON]: ${message}`);
}

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost/inventory").then( () => {
    log("Connected to mongodb database");
    setInterval(async () => {
        const jobs = await models.RepetitiveJob.find({ repeat: true }).populate("source");
        log(`found ${jobs.length} repeatable jobs`);
    }, 1000 * 60);
})
