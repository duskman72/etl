import mongoose from "mongoose";
import * as models from "./model";
import { Logger } from "../shared/Logger";
import moment from "moment";

import DataTypes from "./data-types";
import { DataType } from "./core/DataType";

const getJobs = async () => {
    const jobs = (await models.RepetitiveJob.find({ repeat: true })
        .populate(
            {
                path:"source",
                select: {
                    name: 1,
                    config: 1,
                    _id: 0,
                    type: 1
                },
                populate:{
                    path:"type",
                    select: {
                        _id: 0,
                        typeName: 1
                    }
                }
            }
    )).filter( (job: any) => job.source && job.source.type);
    
    Logger.info(`found ${jobs.length} repeatable jobs`);
    jobs.map( (job: any) => {
        const lastExec = moment(job.lastExec);
        const now = moment();

        const rtype = job.repeatType.concat("s");
        const value = job.repeatValue;

        const diff = lastExec.add(value, rtype);
        if( diff < now ) {
            Logger.info(`Executing import job "${job.name}" for DataSource "${job.source.name}" of DataType "${job.source.type.typeName}": last execution = ${moment(job.lastExec).format("YYYY-MM-DD HH:mm")}`)
            // TODO spawn child process to execute job
            // use base64 encoded data as start arg

            const sc = job.source.config;
            const type = job.source.type.typeName;
            const dt: DataType = new DataTypes[type]();
            dt.exec( sc )
            .then( content => {
                Logger.info(JSON.stringify(content));
                job.lastExec = moment(new Date()).toDate();
                job.save();
            })
            .catch(e => {
                Logger.err( JSON.stringify(e) );
            })
        }
    });
}

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost/inventory").then( () => {
    Logger.info("Connected to mongodb database");
    getJobs();
    setInterval(() => {
        getJobs();
    }, 1000 * 60);
})
