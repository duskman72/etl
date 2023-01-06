declare class KoaRedisSesssion {
    constructor(args);
    get();
    set(x);
    destroy();
}

declare module "koa-redis-session" {
    export = KoaRedisSesssion;
}