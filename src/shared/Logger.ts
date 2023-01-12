import moment from "moment";
import { FluentClient as Fluentd, FluentSocketEvent } from "@fluent-org/logger";

enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    NOTICE = "NOTICE",
    WARNING = "WARN",
    ERR = "ERROR",
    CRIT = "CRIT",
    ALERT = "ALERT",
    EMERG = "EMERG"
}

export type LoggerOpts = {
    context: string,
    console?: boolean,
    remote?: {
        url: string,
        port: number
    }
}

export class Logger {
    private opts;
    private fluentd;

    static create = (opts: LoggerOpts) => {
        return new Logger(opts);
    }

    private log = (level: LogLevel, message, tags: Array<string>) => {
        const time = moment(new Date()).utc().format("YYYY-MM-DD HH:mm");

        const entry = `${time} [${level}] ${this.opts.context}: ${message}`;
        if (this.opts.console) {
            console.log(entry);
        }

        console.log("TAGS: ", tags)
        this.fluentd.emit(this.opts.context, {time, level, context: this.opts.context, message, tags });
    }

    public debug = (message, tags = []) => {
        this.log(LogLevel.DEBUG, message, tags);
    }

    public info = (message, tags = []) => {
       this. log(LogLevel.INFO, message, tags);
    }

    public notice = (message, tags = []) => {
        this.log(LogLevel.NOTICE, message, tags);
    }

    public warning = (message, tags = []) => {
        this.log(LogLevel.WARNING, message, tags);
    }

    public err = (message, tags = []) => {
        this.log(LogLevel.ERR, message, tags);
    }

    public crit = (message, tags = []) => {
        this.log(LogLevel.CRIT, message, tags);
    }

    public alert = (message, tags = []) => {
        this.log(LogLevel.ALERT, message, tags);
    }

    public emerg = (message, tags = []) => {
        this.log(LogLevel.EMERG, message, tags);
    }

    private constructor(opts: LoggerOpts) {
        this.opts = opts;
        this.fluentd = new Fluentd(`etl`, {
            socket: {
                host: 'localhost',
                port: 24224,
                timeout: 3000, // 3 seconds
            },
            
        });

        this.fluentd.socketOn(FluentSocketEvent.ERROR, (err) => {
            console.log("Fluentd Error: ", err)
        })
    }
}
