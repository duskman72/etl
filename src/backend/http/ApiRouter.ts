import { Router } from "express";
import { Credentials, DataSource, DataType } from "../model";
import SourceTypes from "../data-types";
import { RepetitiveJob } from "../model/RepetitiveJob";
import moment from "moment";

export const ApiRouter = Router();

ApiRouter.get("/data-types", (_req, res) => {
    DataType.find().populate("dataSources")
    .exec((error, items) => {
        let responseItems = [];
        if (items.length) {
            items.forEach(item => {
                let config = undefined;
                if (SourceTypes[item.typeName]) {
                    config = (new SourceTypes[item.typeName]).config()
                }

                responseItems.push({
                    _id: item._id,
                    active: item.active || "false",
                    typeName: item.typeName,
                    createdAt: item.createdAt,
                    dataSources: item.dataSources,
                    config
                });
            })
        }
        res.json({ items: responseItems })
    });
});

ApiRouter.get("/data-types/:id", (req, res) => {
    DataType.findOne({_id: req.params.id}).populate("dataSources")
    .exec((error, item) => {
        if (item) {
            let typeConfig = undefined;
            if (SourceTypes[item.typeName]) {
                typeConfig = (new SourceTypes[item.typeName]).config()
            }
            res.status(200).json({
                item: {
                    _id: item._id,
                    active: item.active || "false",
                    typeName: item.typeName,
                    createdAt: item.createdAt,
                    dataSources: item.dataSources,
                    config: typeConfig
                }
            });
            return;
        }
        res.status(404).json({});
    });
})

ApiRouter.delete("/data-types/:id", (req, res) => {
    DataType.findOne({_id: req.params.id})
    .exec(async (error, item) => {
        if (item) {
            const dataSources = await DataSource.find({
                "type": item._id
            });

            if (dataSources.length) {
                for (const ds of dataSources) {
                    await ds.delete();
                }
            }

            item.delete();
            res.status(200).end();
            return;
        }
        res.status(404).end();
    });
})

ApiRouter.post("/data-types", async (req, res) => {
    const typeName = req.body?.typeName;

    let type = await DataType.findOne({typeName});
    if( type ) {
        res.status(200).end();
        return;
    }

    type = new DataType();
    type.typeName = typeName;
    await type.save();

    res.status(201).end();
});

/************************************************************************/

ApiRouter.get("/data-sources", async (_req, res) => {
    const items = await DataSource.find().populate("type");
    const responseItems = items.filter(item => item.type).map( item => {
        let type: any = item.type;
        let typeConfig = undefined;
        if( SourceTypes[type?.typeName] ) {
            typeConfig = (new SourceTypes[type.typeName]).config()
        }

        return {
            _id: item._id,
            name: item.name,
            active: item.active || "false",
            config: item.config,
            type: type ? {
                active: type.active || "false",
                _id: type._id,
                typeName: type.typeName,
                createdAt: type.createdAt,
                config: typeConfig
            } : {},
            createdAt: item.createdAt
        }
    })

    res.json({items: responseItems})
});

ApiRouter.delete("/data-sources/:id", async (req, res) => {
    const item = await DataSource.findOne({_id: req.params.id});
    if( item ) {
        const type = await DataType.findOne({_id: item.type._id});
        if( type ) {
            type.dataSources.pull({_id: item._id});
            await type.save();
        }
        await item.delete();
        res.status(200).end();
        return;
    }
    res.status(404).end();
});

ApiRouter.post("/data-sources", async (req, res) => {
    const typeId = req.body?.typeId;
    const name = req?.body?.name;
    const config = req?.body?.config;

    const type = await DataType.findOne({_id: typeId});
    if( !type ) {
        res.status(404).end();
        return;
    }

    const source = new DataSource();
    source.type = typeId;
    source.name = name;
    source.config = config;
    await source.save();

    type.dataSources.push( source );
    await type.save();

    res.status(201).end();
});

/************************************************************************/

ApiRouter.get("/credentials", async (req, res) => {
    const items = await Credentials.find();
    res.json({items}).end();
});

ApiRouter.post("/credentials", async (req, res) => {
    const name = req.body?.name;
    const config = req.body?.config;
    const type = req.body?.type;

    let cred = await Credentials.findOne({name});
    if( cred ) {
        res.status(400).json({error: {message: "Credentials with name already exists"}});
        return;
    }

    cred = new Credentials();
    cred.name = name;
    cred.config = config;
    cred.type = type;
    await cred.save();

    res.status(201).json( cred );
})

ApiRouter.delete("/credentials/:id", async (req, res) => {
    const item = await Credentials.findOne({_id: req.params.id});
    if( item ) {
        item.delete();
        res.status(200).end();
        return;
    }
    res.status(404).end();
})

/**************************************************************************************/

ApiRouter.get("/jobs", async (req, res) => {
    const items = await RepetitiveJob.find().populate("source");
    res.json({ items: items.filter( item => item.source) }).end();
});

ApiRouter.post("/jobs", async (req, res) => {
    const name = req.body?.name;
    const repeat = req.body?.repeat;
    const jobDate = new Date(req.body?.date);
    const source = req.body?.source;

    const job = new RepetitiveJob();
    job.name = name;
    job.source = source;
    job.jobDate = jobDate;
    
    if( repeat ) {
        job.repeatType = repeat.type;
        job.repeatValue = repeat.value;
        job.repeat = true
    }

    await job.save();

    res.status(200).json(job).end();
});

ApiRouter.delete("/jobs/:id", async (req, res) => {
    const item = await RepetitiveJob.findOne({ _id: req.params.id });
    if (item) {
        item.delete();
        res.status(200).end();
        return;
    }
    res.status(404).end();
})
