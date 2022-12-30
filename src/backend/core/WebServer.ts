import express from "express";
import bodyParser from "body-parser";
import { routes } from "../config/routes";
import session from 'express-session';
import {createClient} from 'redis';
import connectRedis from 'connect-redis';
import gzip from "compression";
import metrics from "express-prom-bundle";

export class WebServer {
    private static initialized = false;

    public static start = () => {
        if( WebServer.initialized ) return;

        const RedisStore = connectRedis(session)
        const redisClient = createClient({
            url: "redis://localhost:6379"
        })

        redisClient.on('error', function (err) {
            throw new Error('Could not establish a connection with redis. ' + err);
        });

        redisClient.connect()

        const app = express();
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(gzip());
        app.disable("x-powered-by");

        app.use(session({
            store: new RedisStore({ client: redisClient }),
            secret: 'secret$%^134',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // if true only transmit cookie over https
                httpOnly: false, // if true prevent client side JS from reading the cookie 
                maxAge: 1000 * 60 * 10 // session max age in miliseconds
            }
        }))

        app.use((_req, res, next) => {
            res.set("Referrer-Policy", "no-referrer");
            res.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
            res.set("X-Frame-Options", "SAMEORIGIN");
            res.set("X-Content-Type-Options", "nosniff");
            next();
        });

        app.use(metrics({ includeMethod: true, includeStatusCode: true, includePath: true }));

        // add routes
        routes.forEach( route => {
            app.use(route.prefix, route.router);
        })

        app.use((req, res, next) => {
            res.status( 404 ).end();
        });

        // start server

        WebServer.initialized = true;
        app.listen(80, () => {
            console.log("Server started")
        })
    }

    private constructor() {
    }
}
