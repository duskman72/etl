import koa from "koa";
import bodyParser from "koa-body";
import compress from "koa-compress";
import zlib from "zlib";
import session from "koa-session";
import RedisStore from "koa-redis-session";
import { routes } from "../config/routes";
import { Logger } from "../../shared/Logger";
import pagination from "koa-pagination-v2";

const logger = Logger.create({
    context: "http-service",
    console: true
});

export class WebServer {
    private static initialized = false;

    public static start = () => {
        if( WebServer.initialized ) return;

        const app = new koa();
        app.use(bodyParser());
        app.use(compress({
            threshold: 1024,
            gzip: {
                flush: zlib.constants.Z_SYNC_FLUSH
            },
            deflate: {
                flush: zlib.constants.Z_SYNC_FLUSH,
            },
            br: false
        }));

        app.use(async (ctx, next) => {
            ctx.set("Referrer-Policy", "no-referrer");
            ctx.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
            ctx.set("X-Frame-Options", "SAMEORIGIN");
            ctx.set("X-Content-Type-Options", "nosniff");
            await next();
        });

        app.use(session({
            key: 'koa:sess',
            maxAge: 86400000,

            store: new RedisStore({
                port: 6379,
                host: '127.0.0.1',
                family: 4,
                db: 0,
                // See: https://github.com/luin/ioredis/blob/HEAD/API.md#new_Redis
                onError: (e) => console.log(e), // Optional. it will be called when redis client emits an error event.
            }),
        }, app));

        app.use(pagination({ defaultLimit: 20, maximumLimit: 50 }));
        
        routes.forEach(route => {
            app.use(route.router.routes()).use(route.router.allowedMethods());;
        })
       
        logger.info("Starting WebServer...");

        app.listen(80, () => {
            WebServer.initialized = true;
            logger.info("WebServer started at port 80 (TBD make configurable!)")
        })
    }

    private constructor() {
    }
}