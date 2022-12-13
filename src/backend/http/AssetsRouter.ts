import { Router } from "express";
import fs from "fs";
import path from "path";
import mime from "mime-types";

export const AssetsRouter = Router();
AssetsRouter.get("/*", (req, res, next) => {
    if( !req.params["0"] ) {
        res.status(404).end();
        return;
    }

    const serverRoot = process.cwd();
    const publicRoot = path.resolve(serverRoot, "public/assets");
    const fileName   = path.resolve(publicRoot, req.params["0"]);

    const exists = fs.existsSync(fileName);
    if( !exists ) {
        res.status(404).end();
        return;
    }

    const stat = fs.statSync( fileName );
    if( stat.isDirectory() ) {
        res.status(404).end();
        return;
    }

    const isMime = mime.lookup(fileName);
    if( isMime ) {
        const contentType = `${mime.lookup(fileName)}`;
        res.set("Content-Type", contentType);
    }

    const stream = fs.createReadStream(fileName);
    stream.pipe( res );
})


