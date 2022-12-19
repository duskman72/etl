import { Router } from "express";
import { DataSource } from "../model/DataSource";
import { DataSourceType } from "../model/DataSourceType";
import SourceTypes from "../data-source-types";
import { Credentials } from "../model/Credentials";

export const ApiRouter = Router();

ApiRouter.get("/data-source-types", async (_req, res) => {
    const items = await DataSourceType.find().populate("dataSources");
    let responseItems = [];
    if( items.length ) {
        items.forEach( item => {
            let config = undefined;
            if( SourceTypes[item.typeName] ) {
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
    res.json({items: responseItems})
});

ApiRouter.get("/data-source-types/:id", async (req, res) => {
    const item = await DataSourceType.findOne({_id: req.params.id}).populate("dataSources");
    if( item ) {
        let typeConfig = undefined;
        if( SourceTypes[item.typeName] ) {
            typeConfig = (new SourceTypes[item.typeName]).config()
        }
        res.status(200).json({item: {
            _id: item._id,
            active: item.active || "false",
            typeName: item.typeName,
            createdAt: item.createdAt,
            dataSources: item.dataSources,
            config: typeConfig
        }});
        return;
    }
    res.status(404).json({item});
})

ApiRouter.delete("/data-source-types/:id", async (req, res) => {
    const item = await DataSourceType.findOne({_id: req.params.id});
    if( item ) {
        const dataSources = await DataSource.find({
            "type": item._id
        });
        
        if( dataSources.length ) {
            for( const ds of dataSources ) {
                await ds.delete();
            }
        }

        item.delete();
        res.status(200).end();
        return;
    }
    res.status(404).end();
})

ApiRouter.post("/data-source-types", async (req, res) => {
    const typeName = req.body?.typeName;

    let type = await DataSourceType.findOne({typeName});
    if( type ) {
        res.status(200).end();
        return;
    }

    type = new DataSourceType();
    type.typeName = typeName;
    await type.save();

    res.status(201).end();
});

/************************************************************************/

ApiRouter.get("/data-sources", async (_req, res) => {
    const items = await DataSource.find().populate("type");
    const responseItems = items.map( item => {
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
            } : null,
            createdAt: item.createdAt
        }
    })

    res.json({items: responseItems})
});

ApiRouter.delete("/data-sources/:id", async (req, res) => {
    const item = await DataSource.findOne({_id: req.params.id});
    if( item ) {
        const type = await DataSourceType.findOne({_id: item.type._id});
        if( type ) {
            type.dataSources = type.dataSources.filter( ds => ds.id != item._id);
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

    const type = await DataSourceType.findOne({_id: typeId});
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

/*
ApiRouter.post("/data-sources/types", async (req, res) => {
    const name = req.body?.name;
    let groups = await InventoryGroup.find({name});
    if( groups.length ) {
        res.status(201).json(groups[0]);
        return;
    }

    const group = new InventoryGroup();
    group.name = name;
    await group.save();
    groups = await InventoryGroup.find({name});
    if( groups.length ) {
        res.status(201).json(groups[0]);
        return;
    }

    // send error to user
})
*/
/*
ApiRouter.get("/inventory/groups/:id", async (req, res) => {
    const _id = req.params.id || -1;
    const group = await InventoryGroup.findOne({_id}).populate("children")
    if( group ) {
        res.json({group});
        return;
    }
    res.status(404).json({});
})

ApiRouter.delete("/inventory/groups/:id", async (req, res) => {
    const group = await InventoryGroup.findOne({_id: req.params.id});
    if( group ) {
        group.delete();
        res.status(200).json({});
        return;
    }
    res.status(404).json({});
})

ApiRouter.get("/inventory/item-groups/:id", async (req, res) => {
    const group = await InventoryItemGroup.findOne({_id: req.params.id}).populate("group");

    const parent = await InventoryGroup.findOne({'children._id':group._id})
    if( group && parent ) {
        res.json({
            group: {
                _id: group._id,
                name: group.name,
                parent: {
                    name: parent.name,
                    _id: parent._id
                }
            }
        });
        return;
    }
    res.status(404).json({});
})

ApiRouter.post("/inventory/item-groups", async (req, res) => {
    const name = req.body?.name;
    const parent = req.body?.parent;

    let group = await InventoryGroup.findOne({_id: parent}).populate("children");
    if( !group ) {
        res.status(404).json({});
        return;
    }

    const iGroup = new InventoryItemGroup({
        name
    });
    await iGroup.save();

    group.children.push(iGroup);
    await group.save();

    res.status(201).json(group);
    return;
})
*/