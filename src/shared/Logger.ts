import moment from "moment";

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

const log = (level: LogLevel, message) => {
    console.log(`${moment(new Date()).utc().format("YYYY-MM-DD HH:mm")} [${level}]: ${message}`);
}

export const Logger = {

    debug: (message) => {
        log(LogLevel.DEBUG, message);
    },

    info: (message) => {
        log(LogLevel.INFO, message);
    },

    notice: (message) => {
        log(LogLevel.NOTICE, message);
    },

    warning: (message) => {
        log(LogLevel.WARNING, message);
    },

    err: (message) => {
        log(LogLevel.ERR, message);
    },

    crit: (message) => {
        log(LogLevel.CRIT, message);
    },

    alert: (message) => {
        log(LogLevel.ALERT, message);
    },

    emerg: (message) => {
        log(LogLevel.EMERG, message);
    },
}