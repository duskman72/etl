import { Router } from "express";
import { DataSource } from "../model/DataSource";
import { DataSourceType } from "../model/DataSourceType";
import SourceTypes from "../data-source-types";

export const ApiRouter = Router();

ApiRouter.get("/data-source-types", async (_req, res) => {
    const items = await DataSourceType.find().populate("dataSources");
    let responseItems = [];
    if( items.length ) {
        items.forEach( item => {
            let type = undefined;
            if( SourceTypes[item.typeName] ) {
                type = new SourceTypes[item.typeName]
            }

            responseItems.push({
                _id: item._id,
                typeName: item.typeName,
                createdAt: item.createdAt,
                dataSources: item.dataSources,
                valid: type ? true : false
            });
        })
    }
    res.json({items: responseItems})
});

ApiRouter.get("/data-source-types/:id", async (req, res) => {
    const item = await DataSourceType.findOne({_id: req.params.id});
    if( item ) {
        res.status(200).json({item});
        return;
    }
    res.status(404).json({item});
})

ApiRouter.delete("/data-source-types/:id", async (req, res) => {
    const item = await DataSourceType.findOne({_id: req.params.id});
    if( item ) {
        // TODO fix data sources dependency
        item.delete();
        res.status(200).json({});
        return;
    }
    res.status(404).json({});
})

ApiRouter.post("/data-source-types", async (req, res) => {
    const typeName = req.body?.typeName;

    let type = await DataSourceType.findOne({typeName});
    if( type ) {
        res.status(200).json({items: [type]});
        return;
    }

    type = new DataSourceType();
    type.typeName = typeName;
    await type.save();

    res.status(201).json({items: [type]});
});

/************************************************************************/

ApiRouter.get("/data-sources", async (_req, res) => {
    const items = await DataSource.find().populate("type");
    res.json({items})
});

ApiRouter.delete("/data-sources/:id", async (req, res) => {
    const item = await DataSource.findOne({_id: req.params.id});
    if( item ) {
        // TODO fix source types dependency!!!
        item.delete();
        res.status(200).json({});
        return;
    }
    res.status(404).json({});
});

ApiRouter.post("/data-sources", async (req, res) => {
    const typeId = req.body?.typeId;
    const name = req?.body.name;

    const type = await DataSourceType.findOne({_id: typeId});
    if( !type ) {
        res.status(404).json({items: []});
        return;
    }

    const source = new DataSource();
    source.type = typeId;
    source.name = name;
    await source.save();

    type.dataSources.push( source );
    await type.save();

    // TBD respond with Fields of DataSourceType
    let sourceType = undefined;
    if( SourceTypes[type.typeName] ) {
        sourceType = new SourceTypes[type.typeName]
    }

    res.status(201).json({item: source, config: sourceType.config()});
});

/************************************************************************/


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