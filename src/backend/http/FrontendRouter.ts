import Router from "koa-router";
import fs from "fs";

export const FrontendRouter = new Router();
const cache = {};
const htmlFile = __dirname + "/frontend.html";

FrontendRouter.all("/:all*", async (ctx) => {
    if( !cache[htmlFile] ) {
        cache[htmlFile] = fs.readFileSync(__dirname + "/frontend.html", "utf-8");
    }
    
    ctx.set("Content-Type", "text/html");
    ctx.body = cache[htmlFile];
})
