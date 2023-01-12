import { RepetitiveJob } from "./model";
import { Logger } from "../shared/Logger";
import moment from "moment";

import DataTypes from "./data-types";
import { DataType } from "./core/DataType";

const logger = Logger.create({
    context: "cron",
    console: true
});

// TODO 
// remove async here, because its blocking other jobs at runtime

const getJobs = async () => {
    const jobs = (await RepetitiveJob.find({ repeat: true })
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
    
    jobs.map( (job: any) => {
        const lastExec = moment(job.lastExec);
        const now = moment();

        const rtype = job.repeatType.concat("s");
        const value = job.repeatValue;

        const diff = lastExec.add(value, rtype);
        if( diff <= now ) {
            logger.info(`Executing import job "${job.name}"`, [job._id.toString()])
            // TODO spawn child process to execute job
            // use base64 encoded data as start arg

            const sc = job.source.config;
            const type = job.source.type.typeName;
            const dt: DataType = new DataTypes[type]();

            dt.exec( sc )
            .then( content => {
                //logger.info(JSON.stringify(content));
                job.lastExec = moment(new Date()).toDate();
                job.save();
            })
            .catch(e => {
                logger.err( JSON.stringify(e) );
            })
        }
    });
}

getJobs();
setInterval(() => {
    logger.info("--- Tick ---")
    getJobs();
}, 1000 * 60);
