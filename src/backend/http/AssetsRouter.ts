import { Router } from "express";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import crypto from "crypto";

const assetsPath = `${process.cwd()}/public/assets`;
const cache = {};

export const AssetsRouter = Router();
AssetsRouter.get("/*", (req, res, next) => {
    if( !req.params["0"] ) {
        res.status(404).end();
        return;
    }

    const assetName = `${req.params["0"]}`;
    const fileName =`${assetsPath}/${assetName}`.replace(/\//g, path.sep);

    if (!fs.existsSync(fileName) ) {
        res.status(404).end();
        return;
    }

    // dont list directory contents
    const stat = fs.statSync( fileName );
    if( stat.isDirectory() ) {
        res.status(404).end();
        return;
    }

    // check ETag in http request header
    if( req.headers["if-none-match"] ) {
        if (cache[fileName] && cache[fileName] === req.headers["if-none-match"]) {
            // send status 304 - "Not Modified"
            res.status(304).end();
            return;
        }
    }

    const isMime = mime.lookup(fileName);
    if( isMime ) {
        const contentType = `${mime.lookup(fileName)}`;
        res.set("Content-Type", contentType);
    }

    if( !cache[fileName] ) {
        const fileBuffer = fs.readFileSync(fileName);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        cache[fileName] = hashSum.digest('hex');
    }

    const etag = cache[fileName];

    res.set("Cache-Control", "public, max-age=120");
    res.set("ETag", etag);

    const stream = fs.createReadStream(fileName);
    stream.pipe( res );
})


