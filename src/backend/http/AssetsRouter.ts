import Router from "koa-router";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import crypto from "crypto";

const assetsPath = `${process.cwd()}/public/assets`;
const cache = {};

export const AssetsRouter = new Router({
    prefix: "/assets"
});

AssetsRouter.get("/:file*", (ctx) => {
    if( !ctx.params.file ) {
        ctx.status = 404;
        return;
    }

    const assetName = `${ctx.params.file}`;
    const fileName =`${assetsPath}/${assetName}`.replace(/\//g, path.sep);

    if (!fs.existsSync(fileName) ) {
        ctx.status = 404;
        return;
    }

    // dont list directory contents
    const stat = fs.statSync( fileName );
    if( stat.isDirectory() ) {
        ctx.status = 404;
        return;
    }

    // check ETag in http request header
    if( ctx.headers["if-none-match"] ) {
        if (cache[fileName] && cache[fileName] === ctx.headers["if-none-match"]) {
            // send status 304 - "Not Modified"
            ctx.status = 304;
            return;
        }
    }

    const isMime = mime.lookup(fileName);
    if( isMime ) {
        const contentType = `${mime.lookup(fileName)}`;
        ctx.response.set("Content-Type", contentType);
    }

    if( !cache[fileName] ) {
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileName);
        cache[fileName] = hashSum.digest('hex');
    }

    const etag = cache[fileName];

    ctx.response.set("Cache-Control", "public, max-age=120");
    ctx.response.set("ETag", etag);

    const stream = fs.createReadStream(fileName);
    ctx.body = stream;
})


