import Router from "koa-router";
import { Credentials, DataSource, DataType } from "../model";
import SourceTypes from "../data-types";
import { RepetitiveJob } from "../model/RepetitiveJob";

const ApiRouterConfig = new Router({
    prefix: "/api"
});

ApiRouterConfig.get("/data-types", async (ctx, next) => {
    let responseItems = [];
    const items = await DataType.find().populate("dataSources")
    if (items?.length) {
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
    ctx.body = { items: responseItems }
});

ApiRouterConfig.get("/data-types/:id", async (ctx) => {
    const item = await DataType.findOne({_id: ctx.params.id}).populate("dataSources");
    if (item) {
        let typeConfig = undefined;
        if (SourceTypes[item.typeName]) {
            typeConfig = (new SourceTypes[item.typeName]).config()
        }
        ctx.body = {
            item: {
                _id: item._id,
                active: item.active || "false",
                typeName: item.typeName,
                createdAt: item.createdAt,
                dataSources: item.dataSources,
                config: typeConfig
            }
        }
        return;
    }
    ctx.status = 404;
})

ApiRouterConfig.delete("/data-types/:id", async (ctx) => {
    const item = await DataType.findOne({_id: ctx.params.id});
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
        ctx.status = 200;
        return;
    }
    ctx.status = 404;
})

ApiRouterConfig.post("/data-types", async (ctx) => {
    const typeName = ctx.body?.typeName;

    let type = await DataType.findOne({typeName});
    if( type ) {
        ctx.status = 200;
        return;
    }

    type = new DataType();
    type.typeName = typeName;
    await type.save();

    ctx.status = 201;
});

/************************************************************************/

ApiRouterConfig.get("/data-sources", async (ctx) => {
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

    ctx.body = {items: responseItems};
});

ApiRouterConfig.delete("/data-sources/:id", async (ctx) => {
    const item = await DataSource.findOne({_id: ctx.params.id});
    if( item ) {
        const type = await DataType.findOne({_id: item.type._id});
        if( type ) {
            type.dataSources.pull({_id: item._id});
            await type.save();
        }
        await item.delete();
        ctx.status = 200;
        return;
    }
    ctx.status = 404;
});

ApiRouterConfig.post("/data-sources", async (ctx) => {
    const typeId = ctx.body?.typeId;
    const name = ctx?.body?.name;
    const config = ctx?.body?.config;

    const type = await DataType.findOne({_id: typeId});
    if( !type ) {
        ctx.status = 404;
        return;
    }

    const source = new DataSource();
    source.type = typeId;
    source.name = name;
    source.config = config;
    await source.save();

    type.dataSources.push( source );
    await type.save();

    ctx.status = 201;
});

/************************************************************************/

ApiRouterConfig.get("/credentials", async (ctx) => {
    const items = await Credentials.find();
    ctx.body = { items };
});

ApiRouterConfig.post("/credentials", async (ctx) => {
    const name = ctx.body?.name;
    const config = ctx.body?.config;
    const type = ctx.body?.type;

    let cred = await Credentials.findOne({name});
    if( cred ) {
        ctx.status = 400;
        ctx.body = {error: {message: "Credentials with name already exists"}};
        return;
    }

    cred = new Credentials();
    cred.name = name;
    cred.config = config;
    cred.type = type;
    await cred.save();

    ctx.status = 201;
})

ApiRouterConfig.delete("/credentials/:id", async (ctx) => {
    const item = await Credentials.findOne({_id: ctx.params.id});
    if( item ) {
        item.delete();
        ctx.status = 200;
        return;
    }
    ctx.status = 404;
})

/**************************************************************************************/

ApiRouterConfig.get("/jobs", async (ctx) => {
    const { limit, page, pageable } = ctx.state.paginate;
    
    const count = await RepetitiveJob.count();
    const total = Math.ceil(count / limit);

    const items = await RepetitiveJob.find()
    .populate("source")
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const data = {
        items: items.filter(item => item.source ),
        _meta: pageable(total)
    }

    ctx.body = data;
});

ApiRouterConfig.post("/jobs", async (ctx) => {
    const name = ctx.body?.name;
    const repeat = ctx.body?.repeat;
    const jobDate = new Date(ctx.body?.date);
    const source = ctx.body?.source;

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

    ctx.status = 201;
});

ApiRouterConfig.get("/jobs/:id", async (ctx) => {
    const item = await RepetitiveJob.findOne({ _id: ctx.params.id })
        .populate(
            {
                path: "source",
                select: {
                    name: 1,
                    config: 1,
                    _id: 0,
                    type: 1
                },
                populate: {
                    path: "type",
                    select: {
                        _id: 0,
                        typeName: 1
                    }
                }
            }
        );
        
    ctx.status = item ? 200 : 404;
    ctx.body = {item};
})

ApiRouterConfig.post("/jobs/:id", async (ctx) => {
    const name = ctx.request.body?.name;

    const item = await RepetitiveJob.findOne({ _id: ctx.params.id })
        .populate(
            {
                path: "source",
                select: {
                    name: 1,
                    config: 1,
                    _id: 0,
                    type: 1
                },
                populate: {
                    path: "type",
                    select: {
                        _id: 0,
                        typeName: 1
                    }
                }
            }
        );

    if( item && name ) {
        item.name = name;
        await item.save();    
    }
    ctx.status = item ? 200 : 404;
    ctx.body = { item };
})

ApiRouterConfig.delete("/jobs/:id", async (ctx) => {
    const item = await RepetitiveJob.findOne({ _id: ctx.params.id });
    if (item) {
        item.delete();
        ctx.status = 200;
        return;
    }
    ctx.status = 404;
})

export const ApiRouter = ApiRouterConfig;