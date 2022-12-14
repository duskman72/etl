import { Router } from "express";
import { DataSource } from "../model/DataSource";
import { DataSourceType } from "../model/DataSourceType";
import SourceTypes from "../types";

export const ApiRouter = Router();

ApiRouter.get("/data-source-types", async (_req, res) => {
    const items = await DataSourceType.find().populate("dataSources");
    let responseItems = [];
    if( items.length ) {
        items.forEach( item => {
            let valid = false;
            if( SourceTypes[item.typeName]) {
                valid = true
            }

            responseItems.push({
                _id: item._id,
                name: item.name,
                typeName: item.typeName,
                createdAt: item.createdAt,
                dataSources: item.dataSources,
                valid
            });
        })
    }
    res.json({items: responseItems})
});

ApiRouter.delete("/data-source-types/:id", async (req, res) => {
    const item = await DataSourceType.findOne({_id: req.params.id});
    if( item ) {
        item.delete();
        res.status(200).json({});
        return;
    }
    res.status(404).json({});
})

ApiRouter.post("/data-source-types", async (req, res) => {
    const name = req.body?.name;
    const typeName = req.body?.typeName;

    let type = await DataSourceType.findOne({name, typeName});
    if( type ) {
        res.status(200).json({items: [type]});
        return;
    }

    type = new DataSourceType();
    type.name = name;
    type.typeName = typeName;
    await type.save();

    res.status(201).json({items: [type]});
});

/************************************************************************/

ApiRouter.get("/data-sources", async (_req, res) => {
    const items = await DataSource.find().populate("dataSourceType");
    res.json({items})
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