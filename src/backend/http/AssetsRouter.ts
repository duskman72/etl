import Router from "koa-router";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import crypto from "crypto";

type CachedFile = {
    fileName: string,
    mimeType: string,
    etag: string,
    content: any
}

const assetsPath = `${process.cwd()}/public/assets`;
const cache: Array<CachedFile> = [];

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

    const cachedFile = cache.find(file => file.fileName === fileName);
    if( cachedFile ) {
        if (ctx.headers["if-none-match"]) {
            if (cache[fileName] && cache[fileName] === ctx.headers["if-none-match"]) {
                ctx.status = 304;
            }
        }

        const etag = cachedFile.etag;
        ctx.response.set("Cache-Control", "public, max-age=120");
        ctx.response.set("ETag", etag);

        const mimeType = cachedFile.mimeType;
        if (mimeType)
            ctx.response.set("Content-Type", mimeType);

        ctx.body = cachedFile.content;

        return;
    }

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

    const isMime = mime.lookup(fileName);
    const mimeType = isMime ? `${mime.lookup(fileName)}` : null;

    const content = fs.readFileSync(fileName);
    const hashSum = crypto.createHash('md5');
    hashSum.update(content);
    const etag = hashSum.digest('base64');

    ctx.response.set("Cache-Control", "public, max-age=120");
    ctx.response.set("ETag", etag);
    if (mimeType)
        ctx.response.set("Content-Type", mimeType);

    const newCachedFile: CachedFile = {
        fileName,
        mimeType,
        etag,
        content
    };
    cache.push( newCachedFile );

    ctx.body = newCachedFile.content;
})


